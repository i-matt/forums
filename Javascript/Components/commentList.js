import React from 'react';
import {FormattedDate, FormattedTime} from 'react-intl';
import axios from 'axios';
import ForumFile from '../../../../public/app/components/forums/forumFile';

//quote "template"
function Quote(props) {
    let userName = props.firstName + ' ' + props.lastName;
    let text = props.text;
    let date = props.createdDate;
    return (
        <div className="well">
            <i className="fa fa-quote-left fa-3x fa-pull-left fa-border" aria-hidden="true"></i>
            <br/>
            <p>{text}</p>
            <footer className="text-right">{userName} - {date}</footer>
        </div>
    );
}

//repeated comment "template"
function CommentPanel(props) {
    let userName = props.person.firstName + ' ' + props.person.lastName;
    let text = props.text;
    let userRole = props.person.role;
    if(userRole === 'Student') {
        userRole = 'Team ' + (props.person.isCaptain ? "Leader" : "Member");
    }
    let userPic = props.person.profilePic;
    let postDate = <FormattedDate
                        value={props.createdDate}
                        year='numeric'
                        month='long'
                        day='2-digit'
                    />;
    let postTime = <FormattedTime
                        value={props.createdDate}
                    />
    let fileList = props.uploadedFiles.map(file => {
        return <ForumFile
                key={file.id}
                    {...file}
                awaitingSubmission={false}
                />
    })

    return (
        <div className="panel panel-default" id={'comment' + props.id}>
            <div className="panel-body forum-panel">
                <div className="forum-flex">
                    <div className="forumSide">
                        <a className="forum-avatar">
                            <img src={userPic} className="img-circle" alt="image" />
                            <div className="author-info">
                                <p>{userName}</p>
                                <p>{userRole}</p>
                            </div>
                        </a>
                    </div>
                    <div className="forum-body">
                        <p>Posted: {postDate} - {postTime}</p>
                        {props.children}
                        <br/>
                        <p>{text}</p>
                        <br/>
                        {fileList}
                        <ul className="list-inline pull-right forum-links">
                            <li><a onClick={() => props.onReplyClick(props.id)}>Reply</a></li>
                            <li><button className="btn btn-danger" onClick ={() => props.onDeleteClick(props.id)}>Delete <i className="fa fa-trash-o"></i></button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommentList(props) {
    const commentList = props.comments.map(elem => {
        return <CommentPanel
                key={elem.id}
                {...elem}
                onReplyClick={props.onReplyClick}
                onDeleteClick={props.onDeleteClick}
                >
                {elem.quote &&
                  <Quote {...elem.quote} />
                }
                </CommentPanel>
    });
    return(
        <div>
            {commentList}
        </div>
    );
}

export default CommentList;