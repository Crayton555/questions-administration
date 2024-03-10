import React from 'react';
import {useHistory} from 'react-router-dom';

const LabelEdit = (props) => {

    const history = useHistory();
    const [formData, updateFormData] = React.useState({
        name: ""
    })

    const handleChange = (e) => {
        updateFormData({
            ...formData, [e.target.name]: e.target.value.trim()
        })
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        const name = formData.name !== "" ? formData.name : props.label.name;

        props.onEditLabel(props.label.id, name);
        history.push("/labels");
    }

    return (<div className="row mt-5">
        <div className="col-md-5">
            <form onSubmit={onFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Label name</label>
                    <input type="text"
                           className="form-control"
                           id="name"
                           name="name"
                           placeholder={props.label.name}
                           onChange={handleChange}
                    />
                </div>
                <button id="submit" type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>)
}

export default LabelEdit;