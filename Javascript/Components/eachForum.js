import React from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class EachForum extends React.Component{
    constructor(props){
        super(props);
    }

    closeForum = (id) => {
        let data = {
            id: id,
            statusId: 4
        }
        axios.put(FORUM_ENDPOINT + id, 
            data)
            .then(resp => {
                swal("Complete", "Forum Has Been Closed", "Success");
                this.props.getForumByStatus(this.props.statusId); 
            })
    }
    
    clickHandler = () => {
        this.props.router.push('/forumview/' + this.props.id);
    }

    render(){
        const status = this.props.statusId;
        return(
            <div>
                <div className="forum-title">
                    <div className="pull-right forum-desc">
                    </div>
                </div>
                <div className="forum-item active">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="forum-icon">
                                <i className={this.props.icons}></i>
                            </div>
                            <a className="forum-item-title" onClick = {this.clickHandler}>{this.props.name}</a>
                            <div className="forum-sub-title">
                                {this.props.description} 
                            </div>
                        </div>
                        <div className="col-md-2 forum-info">
                        {status != 4 &&
                            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#myModal">Close</button>
                        }
                        </div>
                        <div className="col-md-2 forum-info">
                            <div>
                                <small>Last Modified On: {this.props.modifiedDate}</small>
                            </div>
                        </div>
                        <div className="col-md-1 forum-info pull-right">
                            <span className="views-number">
                                {this.props.count}
                            </span>
                            <div>
                                <small>Posts</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title"></h4>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to close the forum? Further commenting will be disabled.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal" onClick = {()=>this.closeForum(this.props.id)}>Yes</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(EachForum)