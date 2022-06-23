import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWalletConnect } from "./redux/blockchain/blockchainActions";
import { fetchData, fetchTotalSupply, fetchEthPrice } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: white;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid white;
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click 'MINT' to mint your NFT.`);
  const [onSuccessScreen, setOnSuccessScreen] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  if (data.ethPrice === 0) {
    dispatch(fetchEthPrice());
  }

  if (data.totalSupply === 0) {
    dispatch(fetchTotalSupply());
  }

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    setOnSuccessScreen(false);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        console.log("err.message: " + err.message);

        if (err.message == "User rejected the transaction") {
          setFeedback("User rejected the transaction.");
        } else {
          setFeedback("Sorry, something went wrong please try again later. If the issue persists, please message the chatbot at the bottom right side of the screen and a CU team member will assist you.");
        }
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        setOnSuccessScreen(true);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  });

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 20, backgroundColor: "var(--primary)", paddingBottom: 70, paddingTop: 120 }}

      >
      <s.SpacerLarge />

      {/* <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 35,
                fontWeight: "bold",
                color: "var(--accent-text)",
                lineHeight: "75%",
                padding: "25px",
              }}
            >
      <p>Minting for batch #2 closes June 22nd</p>
      </s.TextTitle> */}
        <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 24,
              borderRadius: 24,
              border: "4px solid white",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              backgroundImage: (claimingNft ? 'url("/config/images/spaceanimation2.gif")' : 'url("/config/images/darkstars.png")'),
            }}
          >
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The Genesis SkywalkerZ sale has ended
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  But you can still purchase them on&nbsp;
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
                </s.TextDescription>
              </>
            ) : (
              <>
                {(onSuccessScreen || claimingNft) ? null :
                
                  <div>
                    <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 35,
                fontWeight: "bold",
                color: "var(--accent-text)",
                lineHeight: "75%",
              }}
            >

              {onSuccessScreen ? <div>MINT SUCCESSFUL!</div> : <div>{claimingNft ? null :
                <div>1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}</div>}</div>
              }
            </s.TextTitle>
                    <s.TextDescription
                      style={{ textAlign: "center", color: "var(--accent-text)" }}
                    >
                      Excluding gas fees.
                    </s.TextDescription>
                  </div>
                }
                <s.SpacerSmall />
                {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        paddingLeft: "25px",
                        paddingRight: "25px"
                      }}
                    >
                      <p>
                      To mint, connect your wallet (e.g. MetaMask) to the {CONFIG.NETWORK.NAME} network.
                      A SkywalkerZ is required to apply to become a voting member of the Dream DAO.
                      </p>
                <s.SpacerSmall />
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connectWalletConnect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}&nbsp;&nbsp;
                          {/* <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            GET HELP
                          </StyledButton> */}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    {onSuccessScreen ?
                      <div>
                        <s.TextDescription
                          style={{ textAlign: "center", color: "var(--accent-text)" }}
                        >
                          1. View your new SkywalkerZ NFT(s) on&nbsp;
                          <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                            {CONFIG.MARKETPLACE}
                          </StyledLink>!
                        </s.TextDescription>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{ textAlign: "center", color: "var(--accent-text)" }}
                        >
                          2. Click <StyledLink target={"_blank"} href="https://discord.gg/t4w6HUgMcM">
                            here
                          </StyledLink> to join the Dream DAO Discord and learn how to become a Founding Member.
                        </s.TextDescription>
                      </div> :
                      <div>
                        {claimingNft ?
                          <s.TextTitle
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                              paddingBottom: "25px",
                              fontSize: 40,
                              fontWeight: "bold",
                              lineHeight: "100%",
                              textShadow: "5px 5px 5px #000000",
                            }}
                          >
                            MINTING<br/>YOUR<br/>SKYWALKERZ<div class="loading"></div>
                          </s.TextTitle>
                          :
                          <div>
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {feedback}
                            </s.TextDescription>
                            <s.SpacerMedium />
                            {claimingNft ? null :
                              <div>
                                <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                  <StyledRoundButton
                                    style={{ lineHeight: 0.4 }}
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      decrementMintAmount();
                                    }}
                                  >
                                    -
                                  </StyledRoundButton>
                                  <s.SpacerMedium />
                                  <s.TextDescription
                                    style={{
                                      textAlign: "center",
                                      color: "var(--accent-text)",
                                    }}
                                  >
                                    {mintAmount}
                                  </s.TextDescription>
                                  <s.SpacerMedium />
                                  <StyledRoundButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      incrementMintAmount();
                                    }}
                                  >
                                    +
                                  </StyledRoundButton>
                                </s.Container>
                                <s.SpacerSmall />
                                <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                  <StyledButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      claimNFTs();
                                      getData();
                                    }}
                                  >
                                    {claimingNft ? "BUSY" : "MINT"}
                                  </StyledButton>
                                </s.Container>
                              </div>}
                          </div>
                        }
                      </div>
                    }
                  </>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "white",
              width: 500,
              maxWidth: "70vw"
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower it.
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextDescription
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            View the contract on&nbsp;
            <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
              Etherscan
            </StyledLink>
          </s.TextDescription>
          <s.SpacerSmall /> */}
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            View collection on&nbsp;
            <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
              OpenSea
            </StyledLink>
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            View a step-by-step guide for minting&nbsp;
            <StyledLink target={"_blank"} href={CONFIG.MINT_GUIDE}>
              here
            </StyledLink>
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
