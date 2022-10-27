import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTransaction, createTransaction } from '../features/transactions/transactionSlice';

const Form = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('');
    const [editMode, setEditMode] = useState(false);
    const dispatch = useDispatch();
    const { isLoading, isError } = useSelector(state => state.transaction)
    const { editing } = useSelector(state => state.transaction)

    const reset = () => {
        setName('');
        setAmount('');
        setType('');
    }

    //listen for edit mood active
    useEffect(() => {
        const { id, name, amount, type } = editing || {};
        if (id) {
            setEditMode(true);
            setName(name);
            setAmount(amount);
            setType(type);
        } else {
            setEditMode(false);
            reset();
        }
    }, [editing])

    const handelCreate = e => {
        e.preventDefault();
        dispatch(createTransaction({
            name,
            type,
            amount: Number(amount)
        }))
        reset();
    }

    const handleUpdate = e => {
        e.preventDefault();
        dispatch(changeTransaction({
            id: editing?.id,
            data: {
                name: name,
                amount: amount,
                type: type,
            }
        }))
        setEditMode(false);
        reset();
    }


    const cancelEditMode = () => {
        reset();
        setEditMode(false);
    }


    return (
        <div className="form">
            <h3>Add new transaction</h3>

            <form onSubmit={editMode ? handleUpdate : handelCreate}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        required
                        type="text"
                        name="name"
                        placeholder="enter title"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className="form-group radio">
                    <label>Type</label>
                    <div className="radio_group">
                        <input
                            required
                            type="radio"
                            value="income"
                            name="type"
                            checked={type === 'income'}
                            onChange={e => setType('income')}
                        />
                        <label>Income</label>
                    </div>
                    <div className="radio_group">
                        <input
                            type="radio"
                            value="expense"
                            name="type"
                            placeholder="Expense"
                            checked={type === 'expense'}
                            onChange={e => setType('expense')}
                        />
                        <label>Expense</label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Amount</label>
                    <input
                        required
                        type="number"
                        placeholder="300"
                        name="amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                <button className="btn" disabled={isLoading} type="submit">
                    {editMode ? 'Update Transaction' : 'Add Transaction'}
                </button>
                {!isLoading && isError && <p className="error" >There is an error</p>}
            </form>

            {editMode && (
                <button className="btn cancel_edit" onClick={cancelEditMode}>
                    Cancel Edit
                </button>
            )}
        </div>
    );
};

export default Form;