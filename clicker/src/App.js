import React, { useState, useEffect } from "react";

function App() {
  const [points, setPoints] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [autoClicker, setAutoClicker] = useState(false);
  const [autoClickerCost, setAutoClickerCost] = useState(10);
  const [upgradeCost, setUpgradeCost] = useState(50);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  
  const [reward1Claimed, setReward1Claimed] = useState(false);
  const [reward2Claimed, setReward2Claimed] = useState(false);
  const [reward3Claimed, setReward3Claimed] = useState(false);

  const handleClick = () => {
    setPoints(points + clickValue);
    increaseExp(clickValue);
  };

  const increaseExp = (amount) => {
    setExp(prevExp => {
      const newExp = prevExp + amount;
      
      if (newExp >= 100) {
        setLevel(prevLevel => prevLevel + 0.5); 
        return newExp - 100; 
      }
      return newExp; 
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const buyUpgrade = () => {
    if(points >= upgradeCost) {
      setPoints(points - upgradeCost);
      setClickValue(clickValue + 1);
      setUpgradeCost(upgradeCost * 2);
    }
  };

  const buyAutoClicker = () => {
    if(points >= autoClickerCost) {
      setPoints(points - autoClickerCost);
      setAutoClicker(true);
      setAutoClickerCost(autoClickerCost * 2);
    }
  };

  useEffect(() => {
    if(autoClicker){
      const interval = setInterval(() => {
        setPoints(prevPoints => prevPoints + clickValue);
        increaseExp(clickValue);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClicker, clickValue]);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    if(seconds > 600){
      setIsButtonDisabled(false);
    }

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (secs) => {
    const hours = String(Math.floor(secs / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(secs % 60).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  const claimReward = (reward) => {
    if (reward === 1 && seconds >= 600) {
      setPoints(points + 100);
      setReward1Claimed(true);
    } else if (reward === 2 && seconds >= 1200) {
      setClickValue(clickValue + 1);
      setReward2Claimed(true);
    } else if (reward === 3 && seconds >= 1800) {
      setPoints(points + 200);
      setReward3Claimed(true);
    }
  };

  return (
    <div id="glowny">
      <div id="lewy">
        <div id="profil-gracza">
          <h1>Profil Gracza</h1>
          
          <div id="avatar-section">
            <div style={{ marginBottom: '10px' }}>
              <div 
                id="avatar"
                style={{
                  backgroundImage: `url(${avatar})`,
                }}
              />
            </div>
            <input type="file" onChange={handleAvatarChange} />
          </div>

          <div id="exp-section">
            <div className="exp-bar">
              <div className="exp-fill" style={{ width: `${exp}%` }} />
            </div>
            <div className="level">
              <p>Poziom: {level}</p>
            </div>
          </div>
      </div>
      </div>
      <div id="srodkowy">
        <h1>Clicker Game</h1>
        <p>Punkty: {points}</p>
        <button id="przycisk" onClick={handleClick}><b>Kliknij</b> (+{clickValue})</button>
        <br/><br/>
        <button id="przycisk" onClick={buyUpgrade} disabled={points < upgradeCost}>
        <b>Kup Ulepszenie (+ 1 do wartości kliknięcia) - {upgradeCost} punktów</b>
        </button>
        <br/><br/>
        <button id="przycisk" onClick={buyAutoClicker} disabled={points < autoClickerCost}>
        <b>Kup autoClickera - {autoClickerCost} punktów</b>
        </button>
      </div>
      <div id="prawy">
        <h1>Licznik czasu</h1>
        <p>Czas od wejścia na stronę:</p>
        <h2>{formatTime(seconds)}</h2>
        <table id="tabela">
          <thead>
            <tr id="nazwy-nagrody">
              <th> Nagroda za 10 min grania </th>
              <th> Nagroda za 20 min grania </th>
              <th> Nagroda za 30 min grania </th>
            </tr>
          </thead>
          <tbody>
            <tr id="nagrody">
              <td>
                <button 
                  id="nagroda" 
                  onClick={() => claimReward(1)} 
                  disabled={seconds < 600 || reward1Claimed}
                >
                  <b>{reward1Claimed ? "Nagroda odebrana" : "+ 100 punktów"}</b>
                </button>
              </td>
              <td>
                <button 
                  id="nagroda" 
                  onClick={() => claimReward(2)} 
                  disabled={seconds < 1200 || reward2Claimed}
                >
                  <b>{reward2Claimed ? "Nagroda odebrana" : "Kliknięcie X2"}</b>
                </button>
              </td>
              <td>
                <button 
                  id="nagroda" 
                  onClick={() => claimReward(3)} 
                  disabled={seconds < 1800 || reward3Claimed}
                >
                  <b>{reward3Claimed ? "Nagroda odebrana" : "+ 200 punktów"}</b>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
