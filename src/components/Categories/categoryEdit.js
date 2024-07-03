import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from "../../custom-axios/axios";

const CategoryEdit = (props) => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: props.category.name,
        info: props.category.info || "",
        infoTextFormat: props.category.infoTextFormat || "HTML",
        idNumber: props.category.idNumber || "",
        parentId: props.category.parentId || ""
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            axios.get(`/categories/exclude-subtree/${props.category.id}`)
                .then(response => {
                    setCategories(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(true);
                });
        };

        const intervalId = setInterval(() => {
            if (loading) {
                fetchData();
            } else {
                clearInterval(intervalId);
            }
        }, 2000);

        fetchData();

        return () => clearInterval(intervalId);
    }, [props.category]);

    useEffect(() => {
        setFormData({
            name: props.category.name,
            info: props.category.info || "",
            infoTextFormat: props.category.infoTextFormat || "HTML",
            idNumber: props.category.idNumber || "",
            parentId: props.category.parentId || ""
        });
    }, [props.category]);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData, parentId: formData.parentId || null
        };
        props.onEditCategory(props.category.id, submitData);
        history.push("/categories");
    };

    const Loader = () => (<div className="loader">Loading...</div>);

    if (loading) return <Loader />;

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
                            value={formData.name}
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
                            value={formData.info}
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
                            value={formData.idNumber}
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
};

export default CategoryEdit;