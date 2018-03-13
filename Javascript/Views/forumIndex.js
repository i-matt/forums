import React from 'react';
import EachForum from '../components/forum/eachforum';
import axios from 'axios';
import Paging from '../components/logtable/paging';
import { withRouter } from 'react-router';

class ForumIndex extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            all : {},
            forum: '',
            pageSize: 5,
            currentPage: 1,
            nameFilter: null
        };
    }

    componentDidMount = () =>{
        this.getForumByStatus(1);
    }

    //get's all forums by status(tab clicked) via http.post request sending pageSize, pageNum, nameFilter
    getForumByStatus = (value) =>{
        this.setState({
            value: value
        })
        let sendData = {
            pageSize: this.state.pageSize,
            pageNum: this.state.currentPage,
            nameFilter: this.state.nameFilter
        }
        axios.post(FORUM_ENDPOINT+ value, sendData)
            .then(data =>{
                let all = data.data.item;
                let total = all.forumTotal;
                this.setState({
                    all: all,
                    count: total,
                    lastPage: Math.ceil(total/sendData.pageSize)
                }, ()=> this.mapper(value));
            });
    }

    onPageClick = (page) => {
            let pageNumber = this.state.currentPage;
            switch(page){
                case 'first': pageNumber = 1;
                    break;
                case 'prev': if(pageNumber > 1){
                    pageNumber -= 1;
                }
                break;
                case 'next': if (pageNumber < this.state.lastPage){
                    pageNumber +=1;
                } 
                break;
                case 'last': pageNumber = this.state.lastPage;
                    break;
            }
            this.setState({
                currentPage: pageNumber
            }, () => this.getForumByStatus(this.state.value));
        }

    //creates a list of EachForum components to repeat via .map method, passing in props
    mapper = (value) => {
        var icons = [
            'fa fa-star active',
            'fa fa-star complete',
            'fa fa-star-half abandoned',
            'fa fa-ban closed'
        ];
        var mappedArray = this.state.all.forumList.map(obj =>{ 
            return <EachForum 
                getForumByStatus = {this.getForumByStatus}
                key = {obj.id}
                id = {obj.id}
                name = {obj.name}
                description = {obj.description}
                status = {obj.status}
                statusId = {obj.statusId}
                modifiedDate = {obj.modifiedDate}
                icons = {icons[value-1]}
                count = {obj.totalComments}
                />
        })
        this.setState({forum: mappedArray});
    } 
    
    //Routes to form status page
    viewStatus = () => {
        this.props.router.push('/forumstatus');
    }

    render(){
        return(
            <div className="forum-content">
                <div className="ibox-content forum-container">  
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-sm-4">
                            <h2>Forum</h2>
                            <ol className="breadcrumb">
                                <li className="active">
                                    <strong>Forum</strong>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="media ibox-content forum-container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox-content m-b-sm border-bottom">
                                <div className="p-xs">
                                    <div className="pull-left m-r-md">
                                        <i className="fa fa-rocket mid-icon"></i>
                                    </div>
                                    <h2>Project Forums</h2>
                                    <span>View current, completed, abandoned, and closed forums</span>
                                    <div>
                                        <br/>
                                        <ul>
                                            <li><strong>Active: </strong><span><em>All active projects</em></span>
                                            </li>
                                            <li><strong>Completed: </strong><span><em>All completed projects</em></span>
                                            </li>
                                            <li><strong>Abandoned: </strong><span><em>Users either gave up on the project (with approval) or did not complete within the time given</em></span>
                                            </li>
                                            <li><strong>Closed: </strong><span><em>Forums can no longer be commented on due to inactivity</em></span>
                                            </li>
                                        </ul>
                                        <button type="button" className="btn btn-primary pull-right" onClick = {this.viewStatus}>Manage Forum Status</button>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="media ibox-content forum-container">
                    <ul className="nav nav-tabs">
                        <li onClick = {()=>this.getForumByStatus(1)} className="active"><a data-toggle="tab">Active</a></li>
                        <li onClick = {()=>this.getForumByStatus(2)}><a data-toggle="tab">Completed</a></li>
                        <li onClick = {()=>this.getForumByStatus(3)}><a data-toggle="tab">Abandoned</a></li>
                        <li onClick = {()=>this.getForumByStatus(4)}><a data-toggle="tab">Closed</a></li>
                    </ul>
                    <div className="tab-content">
                        <div id="active" className="tab-pane fade in active">
                            {this.state.forum}
                        </div>
                        <Paging currentPage ={this.state.currentPage}
                                onPageClick = {this.onPageClick}/>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(ForumIndex);