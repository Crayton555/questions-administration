import React from 'react';
import {Link} from 'react-router-dom';

const header = (props) => {

    return (<header>
        <nav className="navbar navbar-expand-md navbar-dark navbar-fixed bg-dark">
            <a className="navbar-brand" href="/questions">Question Administration Application</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to={"/questions"}>Questions</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className={"nav-link"} to={"/categories"}>Categories</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to={"/labels"}>Labels</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to={"/categories-drag-drop"}>Category Drag & Drop</Link>
                    </li>
                </ul>
            </div>
        </nav>
    </header>)
}

export default header;