import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import AdminOnly from "../../AdminOnly";

import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";

import "./Verification.css";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      voterCount: undefined,
      voters: [],
    };
  }

  // refreshing once
  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      const voterCount = await this.state.ElectionInstance.methods
        .getTotalVoter()
        .call();
      this.setState({ voterCount: voterCount });
      
      const voters = [];
      for (let i = 0; i < this.state.voterCount; i++) {
        const voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        const voter = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call();
        voters.push({
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        });
      }
      this.setState({ voters: voters });
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  renderUnverifiedVoters = (voter) => {
    const verifyVoter = async (verifiedStatus, address) => {
      await this.state.ElectionInstance.methods
        .verifyVoter(verifiedStatus, address)
        .send({ from: this.state.account, gas: 1000000 });
      window.location.reload();
    };

    return (
      <>
        {voter.isVerified ? (
          <div
            className="container-list success"
            style={{
              backgroundColor: "#e6f7ff", // Soft light blue background for verified
              color: "#3c763d",
              padding: "12px",
              margin: "15px 0",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p style={{ margin: "7px 0px" }}>AC: {voter.address}</p>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
              <tr>
                <th style={{ padding: "8px", backgroundColor: "#b3c6ff", color: "#333", fontWeight: "bold" }}>Name</th>
                <th style={{ padding: "8px", backgroundColor: "#b3c6ff", color: "#333", fontWeight: "bold" }}>Phone</th>
                <th style={{ padding: "8px", backgroundColor: "#b3c6ff", color: "#333", fontWeight: "bold" }}>Voted</th>
              </tr>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f0f8ff" }}>{voter.name}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f0f8ff" }}>{voter.phone}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f0f8ff" }}>{voter.hasVoted ? "True" : "False"}</td>
              </tr>
            </table>
          </div>
        ) : null}

        <div
          className="container-list attention"
          style={{
            backgroundColor: "#f7f7f9",
            color: "#5a5a5a",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: voter.isVerified ? "none" : "block",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#d1d1e0", color: "#333", fontWeight: "bold" }}>Account address</th>
              <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f4f6f9" }}>{voter.address}</td>
            </tr>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#d1d1e0", color: "#333", fontWeight: "bold" }}>Name</th>
              <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f4f6f9" }}>{voter.name}</td>
            </tr>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#d1d1e0", color: "#333", fontWeight: "bold" }}>Phone</th>
              <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f4f6f9" }}>{voter.phone}</td>
            </tr>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#d1d1e0", color: "#333", fontWeight: "bold" }}>Voted</th>
              <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f4f6f9" }}>{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#d1d1e0", color: "#333", fontWeight: "bold" }}>Verified</th>
              <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f4f6f9" }}>{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th style={{ padding: "8px", backgroundColor: "#d1d1e0", color: "#333", fontWeight: "bold" }}>Registered</th>
              <td style={{ padding: "8px", border: "1px solid #ddd", backgroundColor: "#f4f6f9" }}>{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
          <div style={{ marginTop: "10px" }}>
            <button
              className="btn-verification approve"
              disabled={voter.isVerified}
              onClick={() => verifyVoter(true, voter.address)}
              style={{
                backgroundColor: "#1e88e5",
                color: "#fff",
                padding: "10px 15px",
                borderRadius: "5px",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0d47a1")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e88e5")}
            >
              Approve
            </button>
          </div>
        </div>
      </>
    );
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Verification Page." />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <div className="container-main" style={{ padding: "20px", backgroundColor: "#f7f7f9" }}>
          <h3 style={{ color: "#333", fontWeight: "bold" }}>Verification</h3>
          <small style={{ color: "#777" }}>Total Voters: {this.state.voters.length}</small>
          {this.state.voters.length < 1 ? (
            <div className="container-item info" style={{ padding: "15px", backgroundColor: "#e9ecef", borderRadius: "5px" }}>
              None has registered yet.
            </div>
          ) : (
            <>
              <div className="container-item info" style={{ padding: "15px", backgroundColor: "#e9ecef", borderRadius: "5px", textAlign: "center" }}>
                List of registered voters
              </div>
              {this.state.voters.map(this.renderUnverifiedVoters)}
            </>
          )}
        </div>
      </>
    );
  }
}
