import React from 'react';
import {Link} from 'react-router-dom';

const labelTerm = (props) => {
    return (
        <tr>
            <td>{props.term.name}</td>
            <td className={"text-right"}>
                <a title={"Delete"} className={"btn btn-danger"}
                   onClick={() => props.onDelete(props.term.id)}>
                    Delete
                </a>
                <Link className={"btn btn-info ml-2"}
                      onClick={() => props.onEdit(props.term.id)}
                      to={`/labels/edit/${props.term.id}`}>
                    Edit
                </Link>
            </td>
        </tr>
    )
}

export default labelTerm;