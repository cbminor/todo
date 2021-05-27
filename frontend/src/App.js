import React, { Component } from "react";
import { AiFillDelete } from 'react-icons/ai';
import { AiFillEdit } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
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
        id: null,
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

  handleViewChange = (e) => {
    this.setState({view: e.target.value});
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

  editItem = () => {
    console.log(this.state.activeItem);
    const url = "/items/" + this.state.activeItem.id + "/";
    axios.post(url, this.state.activeItem).then((res) => this.refreshList());
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

  handleEditKeyPress = (event) => {
    if(event.key === 'Enter') {
      this.editItem();
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

  setActiveItem = (item) => {
    this.setState({ activeItem: item });
  }

  renderActiveItem = (item) => {
    const isActive = item.id === this.state.activeItem.id;
    if (isActive) {
      return (
        // <li class="list-group-item">
        <div>
        <input id={item.id} type="checkbox" checked={item.complete} onChange={() => this.handleCheckboxChange(item)} class="mr-2 mt-1" />
        <label for={item.id}>
        <form onSubmit={this.editItem}>
          <div class="input-group input-group-sm">
            <input name='title' type="text" value={this.state.activeItem.title} class="form-control" onKeyPress={this.handleEditKeyPress} onChange={this.handleChange} placeholder="Add Item" />
          </div>
        </form>
        </label>
        <AiOutlineCheck class="text-success" onClick={() => this.editItem()} style={floatRight} />
        </div>
        // </li>


      );
    }
    return (
      // <li class="list-group-item">
      <div>
      <input id={item.id} type="checkbox" checked={item.complete} onChange={() => this.handleCheckboxChange(item)} class="mr-2 mt-1" />
      <label for={item.id}>
        {item.title}
      </label>
      <AiFillDelete class="text-danger" onClick={() => this.deleteItem(item)} style={floatRight}/>
      <AiFillEdit class="text-primary" onClick={() => this.setActiveItem(item)} style={floatRight} />
      </div>
      // </li>
    )
  }

  renderItems = () => {
    var items;

    console.log(this.state.view);

    if (this.state.view === 'All') {
      items = this.state.todoList;
    } else if (this.state.view === 'Pending') {
      items = this.state.todoList.filter(
        (item) => item.complete == false
      );
    } else {
      items = this.state.todoList.filter(
        (item) => item.complete == true
      );
    }
    // const items = this.state.todoList


    return items.map((item) => (
      <li class="list-group-item">
      {this.renderActiveItem(item)}
      </li>
      // <li class="list-group-item">
      //   <input id={item.id} type="checkbox" checked={item.complete} onChange={() => this.handleCheckboxChange(item)} class="mr-2 mt-1" />
      //   <label for={item.id}>
      //   { this.renderActiveItem(item) }
      //   </label>
      //   <AiFillDelete class="text-danger" onClick={() => this.deleteItem(item)} style={floatRight}/>
      //   <AiFillEdit class="text-primary" onClick={() => this.setActiveItem(item)} style={floatRight} />
      // </li>
    ));
  };



  render() {
    return (
      <section class="my-2" style={sectionStyle}>
        <h1 class="text-center">To Do List</h1>
        <select class="form-select form-select-sm" aria-label=".form-select-sm example" value={this.state.view} onChange={this.handleViewChange} style={selectStyle}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
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
