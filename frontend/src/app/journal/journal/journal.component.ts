import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Account, Transaction } from 'src/app/model/entities';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  public accountId: number = -1;
  public account: Account|null = null;
  public loading = true;
  public error: any;
  public accountName: string = "";

  public transactions!: Transaction[];

  @ViewChild('dt1') dt1!:Table;

  constructor(private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  clear(table: Table) {
    table.clear();
  }

  globalFilterUpdate(event:any) {
    console.log(JSON.stringify(event.target.value))
    this.dt1.filterGlobal(event.target.value, 'contains');
  }

  watchTransactions(): void {
    this.apollo.watchQuery( {
      query: gql`{ transactions { 
        id
        transactionDate
        description
        amount
        debitAccount{id, name, accountType}
        creditAccount{id, name, accountType}
      }}`,
    })
    .valueChanges.subscribe((result: any) => {
      console.log(result.data);
      this.transactions = result.data?.transactions as Transaction[];
      this.loading = result.loading;
      this.error = result.error;
    })
  }

  public loadData():void {
    this.watchTransactions();
  }

}
