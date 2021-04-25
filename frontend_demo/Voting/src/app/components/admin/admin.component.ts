import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import $ from 'jquery';

// web3 lib
const Web3 = require('web3');
var Voting= require("../../../assets/contract/Voting.json"); //solc complier

// metamask or your node
var web3 = new Web3(Web3.givenProvider || "http://localhost:8546");

// Smart contract object
Voting = new web3.eth.Contract(JSON.parse(Voting.interface), "0x8fb1bd5bcbbdae32ad651f87dd30c10eba102080");



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  web3 = new Web3(Web3.givenProvider || "http://localhost:8546");
  data: any = [];
  show: boolean;
  constructor() { }

  candidateName = [

  ]


  addForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.required
    ])),
    party: new FormControl('', Validators.compose([
      Validators.required
    ])),
  });

  ngOnInit() {
  }

  async addFormSubmit({ value, valid }: { value, valid: boolean }) {
    this.data = value;
    console.log(this.data);

    // Sending Transaction to metamask
    const accounts = await this.web3.eth.getAccounts();

    // Raw transaction
    await Voting.methods.addCandidate(value.name, value.party).send({
      from: accounts[0]
    });

    // Sign tx
    // broadcast tx

  }


  async showTable() {
    this.show = !this.show;

    const candidateCount = await Voting.methods.getNumOfCandidates().call();
    this.candidateName = []
    for (let index = 0; index < candidateCount; index++) {
      var candidate = await Voting.methods.getCandidate(index).call();
      var votes = await Voting.methods.totalVotes(index).call();
      if (candidate[1] != ""){
        this.candidateName.push({
          party : candidate[2],
          name : candidate[1],
          vote : votes
        })
      }
    }


  }
}
// 0x7ab169884e852d71fb56ab26d3890557595af509