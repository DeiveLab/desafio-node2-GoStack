import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let [income, outcome] = [0, 0];
    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.value;
      }
      if (transaction.type === 'outcome') {
        outcome += transaction.value;
      }
    });
    const total = income - outcome;
    const balance = { income, outcome, total };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const balance = this.getBalance();
    if (transaction.type === 'outcome') {
      if (transaction.value > balance.total) {
        throw Error('Insuficient balance');
      }
    }
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
