import React, { Component } from 'react';
import './Account.css';
import Header from './../../components/Header/Header';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { checkResponse } from './../../util/helpers';

import ItemDetailsModal from './../../components/ItemDetailsModal/ItemDetailsModal';

function sqlItemToJsItem(item) {
  item.eligibleForClearance = item.eligible_for_clearance;
  item.clothingType = item.clothing_type;
  item.createdDate = item.created_date;
  item.soldDate = item.sold_date;
  delete item.eligible_for_clearance;
  delete item.clothing_type;
  delete item.created_date;
  delete item.sold_date;
  return item;
}

function jsItemToSqlItem(item) {
  item.clothing_type = item.clothingType;
  item.eligible_for_clearance = item.eligibleForClearance;
  item.created_date = item.createdDate;
  item.sold_date = item.soldDate;
  delete item.clothingType;
  delete item.eligibleForClearance;
  delete item.createdDate;
  delete item.soldDate;
  return item;
}

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      createInfo: {
        eligibleForClearance: true,
        gender: 'girls',
        clothingType: 'pants',
        age: 10,
        price: 5,
        description: '',
      },
      editInfo: {
        eligibleForClearance: true,
        gender: 'girls',
        clothingType: 'pants',
        age: 10,
        price: 5,
        description: '',
      },
      deleteInfo: {
        eligibleForClearance: true,
        gender: 'girls',
        clothingType: 'pants',
        age: 10,
        price: 5,
        description: '',
      }
    }

    this.updateCreateInfo = this.updateCreateInfo.bind(this);
    this.updateEditInfo = this.updateEditInfo.bind(this);
    this.getUsersItems = this.getUsersItems.bind(this);
    this.createItemListing = this.createItemListing.bind(this);
    this.editItemListing = this.editItemListing.bind(this);
    this.deleteItemListing = this.deleteItemListing.bind(this);
    this.openItemDeleteModal = this.openItemDeleteModal.bind(this);
    this.openItemEditModal = this.openItemEditModal.bind(this);
  }

  componentDidMount() {
    this.getUsersItems();
  }

  getUsersItems() {
    let userId = localStorage.userId;
    return axios.post('/api/allItemsForDealer', { id: userId })
      .then(({ data }) => checkResponse(data, this.props.history))
      .then(({ data }) => {
        if (!data || !data.items) return;
        // converts snake case to camel case so we can work with camel case in the component
        data.items.forEach(item => sqlItemToJsItem(item))
        return this.setState({
          items: data.items
        })
      })
  }

  updateCreateInfo(key, value) {
    if ((key === 'price' || key === 'age') && !value.match(/^[0-9]+$/) && value !== "")
      return;
    if (key === 'description' && value.length > 255)
      return;
    let createInfo = this.state.createInfo;
    createInfo[key] = value;
    this.setState({ createInfo })
  }

  updateEditInfo(key, value) {
    if ((key === 'price' || key === 'age') && !value.match(/^[0-9]+$/) && value !== "")
      return;
    if (key === 'description' && value.length > 255)
      return;
    let editInfo = this.state.editInfo;
    editInfo[key] = value;
    this.setState({ editInfo })
  }

  openItemEditModal(i) {
    let selectedItem = JSON.parse(JSON.stringify(this.state.items[i]));
    this.setState({
      editInfo: selectedItem,
      showEditModal: true
    })
  }

  openItemDeleteModal(i) {
    let selectedItem = JSON.parse(JSON.stringify(this.state.items[i]));
    this.setState({
      deleteInfo: selectedItem,
      showDeleteModal: true
    })
  }

  createItemListing() {
    let { gender, clothingType, age, price, description, eligibleForClearance } = this.state.createInfo;
    return axios.post('/api/createItemListing', {
      gender,
      clothingType,
      age,
      price,
      description,
      eligibleForClearance
    })
      .then(({ data }) => {
        if (data.success) return this.setState({
          showCreateModal: false,
          createInfo: {
            eligibleForClearance: true,
            gender: 'girls',
            clothingType: 'pants',
            age: 10,
            price: 5,
            description: '',
          }
        }, this.getUsersItems)
        return alert(data.message);
      })
  }

  editItemListing() {
    let { id } = this.state.editInfo;
    let updates = jsItemToSqlItem(this.state.editInfo);
    return axios.post('/api/updateItemListing', {
      id,
      updates
    })
      .then(({ data }) => {
        if (data.success) {
          let updatedItem = sqlItemToJsItem(data.data);
          let items = this.state.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === updatedItem.id)
              items[i] = updatedItem;
          }
          return this.setState({
            showEditModal: false,
            items
          })
        }
        return alert(data.message);
      })
  }

  deleteItemListing() {
    let { id } = this.state.deleteInfo;
    return axios.post('/api/deleteItemListing', {
      id
    })
      .then(({ data }) => {
        if (data.success) {
          let deletedItem = data.data;
          let items = this.state.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === deletedItem.id)
              items.splice(i, 1);
          }
          return this.setState({
            showDeleteModal: false,
            items
          })
        }
        return alert(data.message);
      })
  }

  render() {
    return (
      <div className="account">
        <Header />
        <button onClick={() => this.setState({ showCreateModal: true })}>Create New Item Listing</button>
        <br />
        <p>Items</p>
        <table className='itemsTable' >
          <tbody>
            <tr>
              <td>#</td>
              <td>gender</td>
              <td>clothing type</td>
              <td>age</td>
              <td>price</td>
              <td>description</td>
              <td>eligible for 50% off last day of event</td>
              <td>Update Item Listing</td>
              <td>Delete Item Listing</td>
            </tr>
            {this.state.items.map((item, i) => {
              let background = (i % 2 === 0) ? '#fff' : '#ccc';
              return <tr key={i} style={{ background }} >
                <td>{i + 1}</td>
                <td>{item.gender}</td>
                <td>{item.clothingType}</td>
                <td>{item.age}</td>
                <td>${item.price}.00</td>
                <td>{item.description}</td>
                <td>{JSON.stringify(item.eligibleForClearance)}</td>
                <td><button onClick={() => this.openItemEditModal(i)} >Update</button></td>
                <td><button style={{ background: 'red' }} onClick={() => this.openItemDeleteModal(i)} >Delete</button></td>
              </tr>
            })}
          </tbody>
        </table>

        {this.state.showCreateModal && <ItemDetailsModal
          closeModal={() => this.setState({ showCreateModal: false })}
          setState={this.setState}
          updateItemInfo={this.updateCreateInfo}
          itemInfo={this.state.createInfo}
          submit={this.createItemListing}
          submitText={'Create'}
        />}

        {this.state.showEditModal && <ItemDetailsModal
          closeModal={() => this.setState({ showEditModal: false })}
          setState={this.setState}
          updateItemInfo={this.updateEditInfo}
          itemInfo={this.state.editInfo}
          submit={this.editItemListing}
          submitText={'Update'}
        />}

        {this.state.showDeleteModal && <ItemDetailsModal
          closeModal={() => this.setState({ showDeleteModal: false })}
          setState={this.setState}
          itemInfo={this.state.deleteInfo}
          submit={this.deleteItemListing}
          submitText={'Delete'}
        />}

      </div>
    );
  }
}

export default withRouter(Account);