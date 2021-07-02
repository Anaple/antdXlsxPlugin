import logo from './logo.svg';
import './App.css';
import { Updatexlsx } from './XlsxRead';
function App() {
  return (
    
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Updatexlsx backendUrl="https://localhost:3000/" showUploadList={false} rules={['A1','A2','A3','A4']}/>

        <Updatexlsx backendUrl="https://localhost:3000/" showUploadList={false} rules={['项目编号','项目名称','项目类型','所属部门','合同金额','项目承包价','项目现金流总额','项目回款','完工进度','项目奖金','报销事项','开支时间','开支类型','开支金额']}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
