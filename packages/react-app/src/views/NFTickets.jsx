import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function NFTickets({
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
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>NFTicketer:</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <a
            href={`https://staging-global.transak.com/?apiKey=b0f75de8-b51b-474b-8404-464a4c619eb7&redirectURL=http://localhost:3000/nftickets&cryptoCurrencyList=ETH&defaultCryptoCurrency=ETH&walletAddress=${address}&disableWalletAddressForm=true&exchangeScreenTitle=NFTickets&isFeeCalculationHidden=true&fiatCurrency=USD`}
            target="_blank"
            rel="noreferrer"
          >
            Fund your account with Transak
          </a>
        </div>
        <Divider />
        <div style={{ margin: 8 }}>
          <h2>Create event</h2>
          <h3>Ticket price</h3>
          <Input
            onChange={e => {
              setTicketPrice(e.target.value);
            }}
          />
          <h3>Number of tickets</h3>
          <Input
            onChange={e => {
              setTicketCount(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              tx(writeContracts.EventPassToken.createEvent(address, ticketCount, ticketPrice));
            }}
          >
            Create event
          </Button>
        </div>
        <Divider />
      </div>
    </div>
  );
}
