import React, { Component } from 'react';
import './ItemDetailsModal.css'

class ItemDetailsModal extends Component {
    render() {
        let { gender, clothingType, age, price, description, eligibleForClearance } = this.props.itemInfo;
        return (
            <div className='itemDetailsModal'>
                <p className='close-x' onClick={() => this.props.closeModal()} >x</p>
                <input className='inputByText' type='checkbox' checked={eligibleForClearance} onChange={() => this.props.updateItemInfo('eligibleForClearance', !eligibleForClearance)} />
                <span className='textByInput' >This item can be sold half off on last day of event</span>
                <p>Gender</p>
                <select value={gender} onChange={e => this.props.updateItemInfo('gender', e.target.value)} >
                    <option>girls</option>
                    <option>boys</option>
                </select>
                <p>Clothing Type</p>
                <select value={clothingType} onChange={e => this.props.updateItemInfo('clothingType', e.target.value)} >
                    {gender === 'girls' && <option>skirt</option>}
                    {gender === 'girls' && <option>dress</option>}
                    <option>pants</option>
                    <option>shorts</option>
                    <option>shirt</option>
                    <option>sweater</option>
                    <option>coat</option>
                    <option>other</option>
                </select>
                <p>Age</p>
                <input value={age} onChange={(e) => this.props.updateItemInfo('age', e.target.value)} />
                <p>Price: ${price}.00</p>
                <input value={price} onChange={e => this.props.updateItemInfo('price', e.target.value)} />
                <p>Description/Comments</p>
                <textarea placeholder='255 character max' value={description} onChange={e => this.props.updateItemInfo('description', e.target.value)} />
                <button onClick={() => this.props.submit()} >{this.props.submitText}</button>
            </div>
        );
    }
}

export default ItemDetailsModal;