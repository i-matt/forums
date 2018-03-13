import React from 'react';
import {FormattedDate, FormattedTime} from 'react-intl';
import axios from 'axios';
import swal from 'sweetalert';

class updateStatus extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: ''
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    updateForumStatus = (id) => {
        let data = {
            id: id,
            statusId: this.state.value 
        };
        if(this.state.value){
            axios.put(FORUM_ENDPOINT + id, data)
                .then(resp => {
                    swal("Complete", "Forum status updated", "success");
                    this.props.getAllForums();
                }
            )
        }   
    }
    
    render(){
        return(
            <tbody>
                <tr>
                    <td>{this.props.name}</td>
                    <td>{this.props.description}</td>
                    <td><FormattedDate
                        value={this.props.modifiedDate}
                        day="numeric"
                        month="long"
                        year="numeric"/>
                    </td>
                    <td>{this.props.status}</td>
                    <td>
                        <select value ={this.state.value} onChange = {this.handleChange}>
                            <option value =''></option>
                            <option value ='1'>Active</option>
                            <option value ='2'>Completed</option>
                            <option value ='3'>Abandoned</option>
                            <option value ='4'>Closed</option>
                        </select>
                    </td>
                    <td> 
                        <button type="button" className="btn btn-primary" onClick= {() => this.updateForumStatus(this.props.id)}> Update </button>
                    </td>
                </tr>
            </tbody> 
        )
    }   
}

export default updateStatus