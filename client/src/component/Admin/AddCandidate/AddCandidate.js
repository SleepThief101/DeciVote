import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";

import AdminOnly from "../../AdminOnly";

import "./AddCandidate.css";

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      accounts: null,
      isAdmin: false,
      header: "",
      slogan: "",
      candidates: [],
      candidateCount: undefined,
      showError: false,
    };
  }

  componentDidMount = async () => {
    // Refresh the page only once
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

      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        this.setState((prevState) => ({
          candidates: [
            ...prevState.candidates,
            {
              id: candidate.candidateId,
              header: candidate.header,
              slogan: candidate.slogan,
            },
          ],
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load web3, accounts, or contract. Check console for details.");
    }
  };

  updateHeader = (event) => {
    this.setState({ header: event.target.value, showError: false });
  };

  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };

  addCandidate = async () => {
    const { header, slogan } = this.state;
    if (header.length < 3 || header.length > 21) {
      this.setState({ showError: true });
      return;
    }
    await this.state.ElectionInstance.methods
      .addCandidate(header, slogan)
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    const { isAdmin, header, slogan, candidates, showError, web3 } = this.state;

    if (!web3) {
      return (
        <>
          {isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    if (!isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Add Candidate Page." />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <h2>Add a New Candidate</h2>
          <small>Total candidates: {candidates.length}</small>
          <div className="container-item">
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <label className="label-ac">
                Header
                <input
                  className="input-ac"
                  type="text"
                  placeholder="e.g., Marcus"
                  value={header}
                  onChange={this.updateHeader}
                />
              </label>
              {showError && (
                <div className="error-message">
                  Header must be between 3 and 21 characters.
                </div>
              )}
              <label className="label-ac">
                Slogan
                <input
                  className="input-ac"
                  type="text"
                  placeholder="e.g., It is what it is"
                  value={slogan}
                  onChange={this.updateSlogan}
                />
              </label>
              <button
                type="button"
                className="btn-add"
                onClick={this.addCandidate}
              >
                Add
              </button>
            </form>
          </div>
        </div>
        <div className="container-main">
          <div className="container-item info">
            <center>Candidates List</center>
          </div>
          {candidates.length < 1 ? (
            <div className="container-item alert">
              <center>No candidates added.</center>
            </div>
          ) : (
            <div className="container-item" style={{ backgroundColor: "#DDFFFF" }}>
              {candidates.map((candidate) => (
                <div className="container-list success" key={candidate.id}>
                  {candidate.id}. <strong>{candidate.header}</strong>: {candidate.slogan}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}
