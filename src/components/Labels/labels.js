import React from "react";
import ReactPaginate from 'react-paginate'
import {Link} from 'react-router-dom';
import LabelTerm from "./labelTerm";

class Labels extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0, size: 5
        }
    }

    render() {
        const offset = this.state.size * this.state.page;
        const nextPageOffset = offset + this.state.size;
        const pageCount = Math.ceil(this.props.labels.length / this.state.size);
        const labels = this.getLabelsPage(offset, nextPageOffset);

        return (<div className={"container mm-4 mt-5"}>
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
        return this.props.labels.map((term, index) => {
            return (
                <LabelTerm key={term.id} term={term} onDelete={this.props.onDelete} onEdit={this.props.onEdit} />
            );
        }).filter((label, index) => {
            return index >= offset && index < nextPageOffset;
        })
    }
}

export default Labels;