import React, { useState, useEffect } from 'react';

interface BalanceProps {
  username: string;
}

const Balance: React.FC<BalanceProps> = ({ username }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  useEffect(() => {
    // Fetch the user's account balance from the backend
    const fetchBalance = async () => {
      try {
        const response = await fetch(`http://localhost:3029/getBalance/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance);
        } else {
          console.error('Failed to fetch balance:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [username]);

  const handleWithdraw = async () => {
    // Initiate a withdrawal to the user's bank account using the backend
    try {
      const response = await fetch('http://localhost:3029/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: withdrawAmount, username }),
      });

      if (response.ok) {
        // Handle success (if needed)
        console.log('Withdrawal initiated successfully');
        // Update the balance locally if needed
        setBalance((prevBalance) => (prevBalance !== null ? prevBalance - withdrawAmount : null));
      } else {
        // Handle error
        console.error('Failed to initiate withdrawal:', response.statusText);
      }
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
    }
  };

  return (
    <div>
      <h2>Your Account Balance</h2>
      {balance !== null ? <p>${balance.toFixed(2)}</p> : <p>Loading...</p>}

      <h2>Withdraw Funds</h2>
      <label>
        Amount:
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
        />
      </label>
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
};

export default Balance;
