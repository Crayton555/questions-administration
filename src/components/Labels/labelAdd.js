import React from 'react';
import {useHistory} from 'react-router-dom';

const LabelAdd = (props) => {

    const history = useHistory();
    const [formData, updateFormData] = React.useState({
        name: ""
    })

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        })
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        const name = formData.name;

        props.onAddLabel(name);
        history.push("/labels");
    }

    return (<div className="row mt-5">
        <div className="col-md-5">
            <form onSubmit={onFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Label Name</label>
                    <input type="text"
                           className="form-control"
                           id="name"
                           name="name"
                           required
                           placeholder="Enter Label name"
                           onChange={handleChange}
                    />
                </div>
                <button id="submit" type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>)
}

export default LabelAdd;