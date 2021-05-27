import React, { Component } from "react";
import { AiFillDelete } from 'react-icons/ai';
import { AiFillEdit } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import axios from "axios";
// import logo from './logo.svg';
import './App.css';

const selectStyle = {
  width: 'auto',
  float: 'right',
};

const sectionStyle = {
  marginRight: '30%',
  marginLeft: '30%',
};

const spanStyle = {
  verticalAlign: 'baseline',
  marginRight: '5px',
  fontSize: '18px',
  fontWeight: 'bold',
};

const floatRight = {
  float: 'right',
  marginLeft: '1rem',
  marginTop: '0.5rem',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'All',
      todoList: [],
      activeItem: {
        title: "",
        complete: false,
      },
      newItem: {
        title: "",
        complete: false,
      },
    };

  };

  componentDidMount() {
    this.refreshList();
  };

  refreshList = () => {
    console.log("Refresh List");
    axios.get('/items/').then((res) => this.setState({ todoList: res.data})).catch((err) => console.log(err));
    this.setState({activeItem: {title: "", complete: false}});
  };

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  }

  handleNewItemChange = (e) => {
    let { name, value } = e.target;

    const newItem = { ...this.state.newItem, [name]: value };
    this.setState({ newItem });
  }

  mySubmitHandler = (e) => {
    console.log("Submitted");
    e.preventDefault();
    this.submitItem();
  }

  submitItem = () => {
    axios.post("/items/", this.state.activeItem).then((res => this.refreshList()));
  }

  submitNewItem = (e) => {
    this.setState({ activeItem: this.state.newItem });
    this.submitItem();
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      this.submitNewItem(event);
    }
  };

  deleteItem = (item) => {
    console.log(item.id);
    const url = "/items/" + item.id + "/";
    axios.delete(url).then((res) => this.refreshList());
  }

  handleCheckboxChange = (item) => {
    console.log(this.state.activeItem);
    let newItem = {id: item.id, title: item.title, complete: !item.complete};
    const url = "/items/" + item.id + "/";
    axios.post(url, newItem).then((res) => this.refreshList());
  };

  renderItems = () => {
    const items = this.state.todoList

    return items.map((item) => (
      <li class="list-group-item">
        <input id={item.id} type="checkbox" checked={item.complete} onChange={() => this.handleCheckboxChange(item)} class="mr-2 mt-1" />
        <label for={item.id}>{ item.title }</label>
        <AiFillDelete class="text-danger" onClick={() => this.deleteItem(item)} style={floatRight}/>
        <AiFillEdit class="text-primary" style={floatRight} />
      </li>
    ));
  };



  render() {
    return (
      <section class="my-2" style={sectionStyle}>
        <h1 class="text-center">To Do List</h1>
        <select class="form-select form-select-sm" aria-label=".form-select-sm example" style={selectStyle}>
          <option selected>All</option>
          <option value="1">Pending</option>
          <option value="2">Completed</option>
        </select>
        <br />
        <div class="card start-50 translate-middle-x mt-4">
          <ul class="list-group list-group-flush">
            {this.renderItems()}
            <li class="list-group-item">
              <form onSubmit={this.submitNewItem} >
                <div class="input-group input-group-sm">
                  <MdAdd class="mt-1 mr-2"/>
                  <input name='title' type="text" value={this.state.newItem.title} class="form-control" onKeyPress={this.handleKeyPress} onChange={this.handleNewItemChange} placeholder="Add Item" />
                </div>
              </form>
            </li>
          </ul>
        </div>
      </section>
    )
  }

}


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
