import React from 'react';
import Status from '../components/forum/status';
import axios from 'axios';
import Paging from '../components/logtable/paging';

class ForumStatus extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            all: '',
            pageSize: 5,
            currentPage: 1,
            nameFilter: null
        }
    }

    componentDidMount = () => {
        this.getAllForums();
    }

    //Gets ALL forums via http post request, currently set to 5 per page in constructor
    getAllForums = () =>{
        let sendData = {
            pageSize: this.state.pageSize,
            pageNum: this.state.currentPage,
            nameFilter: this.state.nameFilter
        }
        axios.post(FORUM_ENDPOINT, sendData)
            .then(data =>{
                let all = data.data.item;
                let list = all.forumList;
                let total = all.forumTotal;
                this.setState({
                    all: all,
                    lastPage: Math.ceil(total/sendData.pageSize)
                }, ()=> this.mapper());
            });
    }

    //creates a list of Status components to repeat via .map method, passing in props
    mapper = () => {
        let newArray = this.state.all.forumList.map(obj =>{
            return <Status
            key = {obj.id}
            id = {obj.id}
            statusId = {obj.statusId}
            name = {obj.name}
            description = {obj.description}
            modifiedDate = {obj.modifiedDate}
            status = {obj.status}
            getAllForums = {this.getAllForums}
            />
        })
        this.setState({
            arrayToPass: newArray
        })
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
        }, () => this.getAllForums());
    }

    render(){
        return(
            <div className="forum-content">
                <div className="ibox-content forum-container">  
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-sm-4">
                            <h2>Forum</h2>
                            <ol className="breadcrumb">
                                <li>
                                    <a href="/radmin#/main">Home</a>
                                </li>
                                <li className="active">
                                    <strong>Forum Status</strong>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="media ibox-content forum-container">
                    <div>
                        <h2>Manage Project Status</h2>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Description</th>
                                    <th>Last Modified</th>
                                    <th>Status</th>
                                    <th>Change Status</th>
                                </tr>
                            </thead>
                            {this.state.arrayToPass}
                        </table>
                    </div>
                    <Paging 
                    currentPage ={this.state.currentPage}
                    onPageClick = {this.onPageClick}/>
                </div>
            </div>
        )
    }
}

export default ForumStatus