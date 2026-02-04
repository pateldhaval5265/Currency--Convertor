import { useEffect,useState } from 'react';
import './App.css';
import Loader from './Components/Loader';
import LoadingBar from 'react-top-loading-bar'
import Navbar from './Components/Navbar';

function App() {
  document.body.style.backgroundColor='white';
  const[symbol,updateSymbol]=useState({});
  const[bool,updatebool]=useState(false);
  const[loading,setloading]=useState(0);
  const[error,setError]=useState(null);
  const[converting,setConverting]=useState(false);

  async function getsymbol(){
    try {
      setError(null);
      let getsys=await fetch("https://api.exchangerate.host/symbols");
      if(!getsys.ok) {
        throw new Error(`HTTP error! status: ${getsys.status}`);
      }
      let parsedData=await getsys.json();
      if(!parsedData.symbols) {
        throw new Error('Invalid API response');
      }
      let tempsymbol=await parsedData.symbols;
      updateSymbol(tempsymbol); 
      updatebool(true);
    } catch (err) {
      console.error('Error fetching currency symbols:', err);
      setError('Failed to load currency symbols. Please try again later.');
      updatebool(false);
    }
  }

useEffect(()=>{
  getsymbol();
},[])

  const generateCurrencyOptions = (selectedCode = null) => {
    if (!bool || !symbol) return null;
    
    return Object.entries(symbol).map(([code, data]) => (
      <option 
        key={code} 
        value={data.code} 
        selected={selectedCode === data.code}
      >
        {data.description}
      </option>
    ));
  };

  let getData=async()=>{
    if (converting) return;
    
    try {
      setConverting(true);
      setError(null);
      setloading(10);
      
      let from=document.getElementById("d1").value;
      let to=document.getElementById("d2").value;
      let amount=document.getElementById("l1").value;
      
      if (!from || !to || !amount || isNaN(amount) || amount <= 0) {
        throw new Error('Please enter valid values for all fields');
      }
      
      setloading(30);
      let tempdata=await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
      setloading(60);
      
      if(!tempdata.ok) {
        throw new Error(`HTTP error! status: ${tempdata.status}`);
      }
      
      let parsedData=await tempdata.json();
      setloading(95);
      
      if(!parsedData.result && parsedData.result !== 0) {
        throw new Error('Invalid conversion response');
      }
      
      document.getElementById('l2').value=parsedData.result.toFixed(2);
      setloading(100);
    } catch (err) {
      console.error('Error converting currency:', err);
      setError(err.message || 'Conversion failed. Please try again.');
      document.getElementById('l2').value='';
    } finally {
      setConverting(false);
      setTimeout(() => setloading(0), 1000);
    }
  }
  // console.log(symbol);
  return (
      <>
            <Navbar/>
           
            <div className="container-md mt-md-5 ">
            
            <div className="row">
            
              {!bool && <Loader />}
              <div className="col-md-5 my-4">
            
            <label htmlFor="d1" className="fs-3 mb-1 mt-2">From : </label>
            <select id="d1" className="form-select bg-light fs-5">
                  {generateCurrencyOptions('USD')}
            </select>
            <label htmlFor="l1"  className="mt-1 fs-3">Amount : </label>
            <input type="text" id="l1" className={`form-control`} />
              </div>
              <div className="offset-md-2 col-md-5 my-2">
              
            <label htmlFor="d2" className="fs-3 mb-1 mt-2">To : </label>
            <select id="d2" className="form-select bg-light fs-5">
                  {generateCurrencyOptions('INR')}
            </select>
            <label htmlFor="l2"  className="mt-1 fs-3">Amount : </label>
            <input type="text" name="" id="l2" className={`form-control`} />
              </div>
            </div>
            {error && (
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                </div>
              </div>
            )}
            <div className="row mt-2">
              <div className="mt-md-5 offset-md-4 col-md-4">
                <button 
                  className="btn fs-5 btn-primary w-100" 
                  onClick={getData}
                  disabled={converting || !bool}
                >
                  {converting ? 'Converting...' : 'Convert'}
                </button>
              </div>
            </div>
            </div>
            <LoadingBar
        color='#f11946'
        height={4 }
        progress={loading}
        onLoaderFinished={() => setloading(0)}
      />
      </>
  );
}

export default App;
