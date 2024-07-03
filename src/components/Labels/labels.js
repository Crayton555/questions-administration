import React from "react";
import ReactPaginate from 'react-paginate'
import {Link} from 'react-router-dom';
import LabelTerm from "./labelTerm";

class Labels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0, size: 5, searchTerm: ""
        }
    }

    render() {
        const offset = this.state.size * this.state.page;
        const nextPageOffset = offset + this.state.size;
        const pageCount = Math.ceil(this.props.labels.length / this.state.size);
        const labels = this.getLabelsPage(offset, nextPageOffset);

        return (<div className={"container mm-4 mt-5"}>
            <div className={"row mb-4"}>
                <div className="col">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={this.state.searchTerm}
                        onChange={(e) => this.setState({searchTerm: e.target.value})}
                        className="form-control"
                    />
                </div>
            </div>
            <div className={"row"}>
                <div className={"table-responsive"}>
                    <table className={"table table-striped"}>
                        <thead>
                        <tr>
                            <th scope={"col"}>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {labels}
                        </tbody>
                    </table>
                </div>
                <div className="col mb-3">
                    <div className="row">
                        <div className="col-sm-12 col-md-12">
                            <Link className={"btn btn-block btn-dark"} to={"/labels/add"}>Add new label</Link>
                        </div>
                    </div>
                </div>
            </div>
            <ReactPaginate previousLabel={"back"}
                           nextLabel={"next"}
                           breakLabel={<a href="/#">...</a>}
                           breakClassName={"break-me"}
                           pageClassName={"ml-1"}
                           pageCount={pageCount}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           onPageChange={this.handlePageClick}
                           containerClassName={"pagination m-4 justify-content-center"}
                           activeClassName={"active"}/>
        </div>);
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        this.setState({
            page: selected
        })
    }
    getLabelsPage = (offset, nextPageOffset) => {
        const filteredLabels = this.props.labels
            .filter(label => label.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
            .filter((label, index) => index >= offset && index < nextPageOffset);

        return filteredLabels.map((term) => (
            <LabelTerm key={term.id} term={term} onDelete={this.props.onDelete} onEdit={this.props.onEdit}/>));
    }
}

export default Labels;