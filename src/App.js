import { useEffect, useState } from 'react';
import './App.css';
import {GrAdd} from 'react-icons/gr'
function App() {
  const [name, setName] = useState('')
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState('')

  useEffect(() => {
    getTransactions().then(setTransactions)
  }, []);
  async function getTransactions(){
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev){
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL+'/transaction';
    console.log(url)
    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({price, name:name.substring(price.length+1), description, datetime}),
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDescription('');
        setDatetime('');
        console.log('result', json);
      })
    });
  }
  let balance = 0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }

  return (
    <div className="App">
      <div className='title'>
        <p>Expense Tracker</p>
      </div>

      <div className='balance'>
        <p>Balance :</p><span>₹ {balance} /-</span>
      </div>
    <form onSubmit={addNewTransaction}>
      <div className='inputs'>
        <input type='text' placeholder='Enter amount of expense' value={name} onChange={ev => setName(ev.target.value)} />
        <input type='datetime-local' value={datetime} onChange={ev => setDatetime(ev.target.value)} />
        <input type='text' placeholder='Enter description' value={description} onChange={ev => setDescription(ev.target.value)} />
        <button><GrAdd /></button>
      </div> 
    </form>
      {transactions.length>0 && transactions.map(transaction => (
        <div className='expenses'>
          <div className='name'>{transaction.name}</div>
          <div className='tracking'>
            <span className={'price ' + transaction.price<0?'red':'green'}>{transaction.price}</span>
            <span className='dtime'>{transaction.datetime}</span>
        </div>
      </div>
      ))}
      
    </div>
  );
}

export default App;
