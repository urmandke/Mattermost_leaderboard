import React,{ useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { RowData } from '../../models/models';
import { fetch_data } from '../../services/authService';
import './Home.css'


const Home: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const fetched_data = await fetch_data(sessionStorage.token);
    console.log(fetched_data);
    setData(fetched_data);
  };

  useEffect(() => {
    // Fetch initial data
    if(!sessionStorage.token){
      navigate('/login');
    }
  }, [navigate]);

  return (<div>
    <center><h1>Leaderboard</h1></center>
    <div className="table-container">
    <table className="styled-table">
      <thead>
        <tr>
          <th>User Email</th>
          <th>Posts</th>
        </tr>
      </thead>
      <tbody>
        {data.sort((a, b) => {
           if (a.interactions < b.interactions) {
            return  1;
          }
          if (a.interactions > b.interactions) {
            return  -1;
          }
          return 0
        }).map((row, index) => (
          <tr key={index}>
            <td>{row.user}</td>
            <td>{row.interactions}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button className="refresh-button" onClick={fetchData}>Refresh</button>
  </div>
  </div>
  );
};

export default Home;