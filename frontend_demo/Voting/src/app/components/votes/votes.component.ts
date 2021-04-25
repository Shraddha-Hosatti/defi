import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


const Web3 = require('web3');
var Voting= require("../../../assets/contract/Voting.json");
var web3 = new Web3(Web3.givenProvider || "http://localhost:8546");


Voting = new web3.eth.Contract(JSON.parse(Voting.interface), "0x8fb1bd5bcbbdae32ad651f87dd30c10eba102080");


@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

  show: boolean;
  vote: boolean;
  demoData = []
  constructor() { }



  voteForm = new FormGroup({
    voterId: new FormControl('', Validators.compose([
      Validators.required
    ])),
    name: new FormControl('', Validators.compose([
      Validators.required
    ])),
  });


  async ngOnInit() {

    const candidateCount = await Voting.methods.getNumOfCandidates().call();
    this.demoData = []
    for (let index = 0; index < candidateCount; index++) {
      var candidate = await Voting.methods.getCandidate(index).call();
      var votes = await Voting.methods.totalVotes(index).call();
      if (candidate[1] != ""){
        this.demoData.push({
          id : candidate[0],
          name : candidate[1]
        })
      }

  }
}

  showData() {
    this.show = true;
  }

  toVote() {
    this.vote = true;
  }


  async voteFormSubmit({ value, valid }: { value, valid: boolean }) {
    var voterid = value.voterId;
    var candidatId = value.name;

    const accounts = await web3.eth.getAccounts();
    await Voting.methods.vote(voterid, candidatId).send({
      from: accounts[0]
    });

  }

}
