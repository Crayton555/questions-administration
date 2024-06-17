import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "../../custom-axios/axios";

const CategoryAdd = (props) => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: "",
        info: "",
        infoTextFormat: "HTML",
        idNumber: "",
        parentId: ""
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('/categories')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to fetch categories");
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            parentId: formData.parentId || null
        };
        props.onAddCategory(submitData);
        history.push("/categories");
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="row mt-5">
            <div className="col-md-6">
                <form onSubmit={onFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Category Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            required
                            placeholder="Enter category name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="info">Information</label>
                        <textarea
                            className="form-control"
                            id="info"
                            name="info"
                            placeholder="Enter detailed information"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="idNumber">ID Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="idNumber"
                            name="idNumber"
                            placeholder="Enter ID Number"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="infoTextFormat">Info Text Format</label>
                        <select
                            className="form-control"
                            id="infoTextFormat"
                            name="infoTextFormat"
                            value={formData.infoTextFormat}
                            onChange={handleChange}
                        >
                            <option value="HTML">HTML</option>
                            <option value="MOODLE_AUTO_FORMAT">Moodle Auto Format</option>
                            <option value="PLAIN_TEXT">Plain Text</option>
                            <option value="MARKDOWN">Markdown</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="parentId">Parent Category</label>
                        <select
                            className="form-control"
                            id="parentId"
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                        >
                            <option value="">No Parent</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CategoryAdd;