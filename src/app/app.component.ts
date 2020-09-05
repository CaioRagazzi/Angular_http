import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isLoading: boolean = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostsService) { }

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })
    this.onFetchPosts();
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isLoading = true;
    this.postService.fetchPosts().subscribe(postData => {
      this.loadedPosts = postData;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.error = error.message;
    })
  }

  onClearPosts() {
    this.postService.clearPosts().subscribe(() => {
      this.onFetchPosts();
    });
  }

  onHandleError(){
    this.error = null;
  }
}
