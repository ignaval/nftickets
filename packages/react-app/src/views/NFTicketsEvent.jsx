import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";

export default function NFTicketsEvent({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [eventId, setEventId] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [ticketsAvailable, setTicketsAvailable] = useState(0);
  const [myTickets, setMyTickets] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);

  useEffect(() => {
    console.log("EventId", eventId);
    const getAvailable = async () => {
      try {
        const ts = await readContracts.EventPassToken?.availableTickets(eventId);
        const tsPrice = await readContracts.EventPassToken?.eventPrice(eventId);
        const mTickets = await readContracts.EventPassToken?.balanceOf(address, eventId);
        console.log(ts.toNumber(), tsPrice.toNumber(), mTickets.toNumber());
        setTicketsAvailable(ts.toNumber());
        setTicketPrice(tsPrice.toNumber());
        setMyTickets(mTickets.toNumber());
      } catch (e) {
        console.log(e);
        setTicketsAvailable(0);
        setTicketPrice(0);
      }
    };

    getAvailable();
  });

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>NFTicktes Event:</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <a
            href={`https://staging-global.transak.com/?apiKey=b0f75de8-b51b-474b-8404-464a4c619eb7&redirectURL=http://localhost:3000/nfticketsevent&cryptoCurrencyList=ETH&defaultCryptoCurrency=ETH&walletAddress=${address}&disableWalletAddressForm=true&exchangeScreenTitle=NFTickets&isFeeCalculationHidden=true&fiatCurrency=USD`}
            target="_blank"
            rel="noreferrer"
          >
            Fund your account with Transak
          </a>
        </div>
        <Divider />
        <div style={{ margin: 8 }}>
          <h2>Buy tickets</h2>
          <h3>Event Id</h3>
          <Input
            placeholder="0"
            onChange={e => {
              setEventId(parseInt(e.target.value));
            }}
          />
          <h3>Number of tickets</h3>
          <p>Ticket price (wei): {ticketPrice}</p>
          <p>Tickets available: {ticketsAvailable}</p>
          <p>My tickets for this event: {myTickets}</p>
          <Input
            onChange={e => {
              setTicketCount(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              console.log(ticketCount * ticketPrice);
              tx(
                writeContracts.EventPassToken.buyPass(eventId, ticketCount, {
                  value: ticketCount * ticketPrice,
                }),
              );
            }}
          >
            Buy {ticketCount} tickets
          </Button>
        </div>
        <Divider />
      </div>
    </div>
  );
}
