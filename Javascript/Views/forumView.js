import React from 'react';
import axios from 'axios';
import CommentList from '../components/forum/commentlist';
import PostInput from '../../../public/app/components/forums/postInput';
import PageButton from '../../../public/app/components/forums/pageButton';
import File from '../../../public/app/components/fileupload/files';
import ForumFile from '../../../public/app/components/forums/forumFile';
import MemberDropdown from '../../../public/app/components/forums/memberDropdown';
import {Link} from 'react-router';

class ForumView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                forumTitle:{},
                comments: [],
                teamMembers: []
            },
            pageSize: 7,
            pageNum: 1,
            maxCommentSize: 1000,
            replyTo: 0,
            prevBtnDisabled: false,
            nextBtnDisabled: false,
            submitDisabled: true,
            reportText: "",
            fileList: []
        };
    }

    componentDidMount = () => {
        this.getPage();
    }

    getPage = () => {
        let getData = {
            forumId: this.props.params.id,
            pageSize: this.state.pageSize,
            pageNum: this.state.pageNum
        }
        axios.post(FORUM_COMMENTS_ENDPOINT, getData)
        .then(resp => {
            let data = resp.data.item;
            //Reverse comments to put newest on bottom of page
            data.comments = data.comments.reverse();
            //Calculate the max page
            let maxPage = Math.ceil(data.totalComments / this.state.pageSize);
            //Find which paging button should be disabled
            let currPage = this.state.pageNum;
            let prevBtnDisabled = false;
            let nextBtnDisabled = false;
            if(currPage === maxPage) {
                prevBtnDisabled = true;
            }
            else if(currPage === 1) {
                nextBtnDisabled = true;
            }
            this.setState({
                data: data,
                maxPage: maxPage,
                prevBtnDisabled: prevBtnDisabled,
                nextBtnDisabled: nextBtnDisabled
            });
        });
    }

    handleReplyClick = id => {
        const comments = this.state.data.comments;
        //Find the index of the comment we clicked reply on
        let commentIdx = comments.findIndex(com =>{
            if(com.id === id) {
                return true;
            }
        });
        //If the reply wasn't found then return
        if(commentIdx === -1) {
            return;
        }
        //Get the reply data from the one we clicked
        let reply = comments[commentIdx];
        let replyText = reply.text;
        if(replyText.length > 15) {
            replyText = replyText.slice(0, 15) + "...";
        }
        this.setState({
            replyTo: {
                id: id,
                name: reply.person.firstName + " " + reply.person.lastName,
                text: replyText,
                time: reply.createdDate
            }
        }, () => {
            //Scroll down to the input box
            $("html, body").animate({ scrollTop: $(document).height() });
        });
    }

    handlePageClick = page => {
        //If the user clicked on a disabled button don't do anything
        if((page === 'prev' && this.state.prevBtnDisabled) || (page === 'next' && this.state.nextBtnDisabled)){
            return;
        }
        //Calculate which direction to go based on the button the user clicked
        let currPage = this.state.pageNum;
        if(page === 'prev') {
            if(currPage < this.state.maxPage) {
                currPage++;
            }
        } else if(page === 'next') {
            if(currPage > 1) {
                currPage--;
            }
        }
        this.setState({
            pageNum: currPage
        }, () => this.getPage())
    }

    handleInputChange = e => {
        let value = e.target.value;
        let submitDisabled = true;
        if(value.trim().length > 0) {
            submitDisabled = false;
        }
        //If the current comment is longer than the max comment size don't let them type anymore
        if(value.length > this.state.maxCommentSize) {
            value = value.slice(0, this.state.maxCommentSize);
        }
        this.setState({
            [e.target.name]: value,
            submitDisabled: submitDisabled,
        });
    }

    handleSubmitClick = () => {
        const postComment = this.state.postComment;
        const fileList = this.state.fileList.map(file => {
            return file.id
        });
        let postData = {
            forumId: this.props.params.id,
            quoteId: this.state.replyTo.id,
            text: postComment,
            files: fileList
        }
        axios.post(FORUM_COMMENTS_ENDPOINT, postData)
        .then(resp => {
            let id = resp.data.item;
            this.getPage();
        })
        this.setState({
            replyTo: 0,
            postComment: "",
            submitDisabled: true,
            fileList: []
        })
    }

    handleDeleteComment = id => {
        axios.delete(FORUM_COMMENTS_ENDPOINT+ id)
            .then(resp =>{
                this.getPage()
            })
    }

    handleCancelReply = () => {
        this.setState({
            replyTo: 0
        });
    }
    
    handleFileInput = e => {
        const files = e.target.files; 
        for(let i = 0; i < files.length ; i++){
            var formdata = new FormData();
            formdata.append("file", files[i]);
            axios.post(FILE_UPLOAD_ENDPOINT,formdata)
                .then(resp => {
                    let fileId = resp.data.item;
                    this.getFileById(fileId)
                    .then(file => {
                        this.setState((prevState, props) => {
                            fileList: prevState.fileList.push(file)
                        });
                    });
                });
        }
    }

    handleDeleteFile = id => {
        axios.delete(FILE_UPLOAD_ENDPOINT + id)
            .then(resp => {
                let fileList = this.state.fileList;
                let filtered = fileList.filter((file) => id !== file.id);
                this.setState({
                    fileList: filtered
                });
            })
    }

    getFileById = id => {
        return axios.get(FILE_UPLOAD_ENDPOINT + id)
            .then(resp => {
                return resp.data.item;
            });
    }

    render() {
        const data = this.state.data;
        const forumName = data.name;
        const forumDescription = data.description;

        const submitDisabled = this.state.submitDisabled;
        const replyTo = this.state.replyTo;
        const postComment = this.state.postComment;
        const maxCommentSize = this.state.maxCommentSize;

        const prevBtnDisabled = this.state.prevBtnDisabled;
        const nextBtnDisabled = this.state.nextBtnDisabled;

        const files = this.state.fileList.map((file) => {
            return <ForumFile 
                    key={file.id}
                    {...file}
                    deleteFile={this.handleDeleteFile}
                    awaitingSubmission={true}
                    />
        });
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-md-2">
                        <Link to='/forumindex' className="btn btn-primary forum-back-btn"><span aria-hidden="true">&larr;</span> Back To Forums</Link>                                        
                    </div>
                    <div className="col-md-8">
                        <h2 className="text-center">{forumName}</h2>
                        <h4 className="text-center">{forumDescription}</h4>
                    </div>
                    <div className="col-md-2">
                        <MemberDropdown teamList={data.teamMembers} />
                    </div>
                </div>
                <div className="forum-content">
                    <CommentList 
                        comments={data.comments} 
                        onReplyClick={this.handleReplyClick} 
                        onDeleteClick={this.handleDeleteComment}
                    />
                    <PostInput 
                        submitDisabled={submitDisabled} 
                        replyTo={replyTo} 
                        value={postComment} 
                        maxLength={maxCommentSize}
                        fileList={files}
                        cancelReply={this.handleCancelReply} 
                        onInputChange={this.handleInputChange} 
                        onSubmitClick={this.handleSubmitClick} 
                        onFileInput={this.handleFileInput}
                    />
                    <PageButton 
                        prevBtnDisabled={prevBtnDisabled} 
                        nextBtnDisabled={nextBtnDisabled} 
                        onPageClick={this.handlePageClick} 
                    />
                </div>
            </div>
        );
    }
}

export default ForumView;