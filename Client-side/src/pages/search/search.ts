import { GetBook } from './../../providers/getBook.service';
import { DetailViewPage } from './../detail-view/detail-view';
import { HomeBodyService } from './../../providers/home-body.service';
import { CategoriesPage } from './../categories/categories';
import { NavController} from 'ionic-angular';
import { Search ,Data} from './../../providers/search.service';
import { Input,Output,EventEmitter } from '@angular/core';
import { NavParams,PopoverController } from 'ionic-angular'; 
import { Component,OnInit } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import {AdalService} from 'ng2-adal/core';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage{
 homeBook;
 
   @Output()
  bookChange=new EventEmitter();
  @Input()
  get book(){
  return this.homeBook
}
set book(val){
this.homeBook=val;
this.bookChange.emit(this.homeBook)
}
  slideOptions={
    pager: true
  }
 Books:any[];
 showStyle:false;
 token;
  loaded:any;
  length:boolean;
 originalCategories:any[];
 categories:any[];
 searchInput:string;
 showSearch:boolean;
  categorisedBooks:any[];
 showSlides:boolean=true;
 selectTitle:boolean=false;
   selectAuthor:boolean=false;
  constructor(public loadingCtrl: LoadingController,public nav:NavController,private search:Search,public adalService: AdalService,public navParams: NavParams,public popoverCtrl: PopoverController,public HomeBodyService: HomeBodyService,private getBook:GetBook) {
this.token=HomeBodyService.token;

  }
 
 
//    getAllBooks(){
//     console.log('inside service getallbooks');
//     this.search.getAllBook().subscribe(
//       data =>{
// this.book = data
// console.log(this.book);
//       } ,
//       error => console.log(error)
//     );
//   }
//  ionViewDidLoad() {
//     console.log('ionViewDidLoad SearchPage');
//      this.getAllBooks();
//      this.getCategories();
//  }
 getCategories=function(){
     console.log("in getCategories")

   this.search.getCategories(this.token).subscribe(data =>{
      //  if(data.length>=1)
      //  {
            //  this.loaded=true;
          this.categories=data[0].categories;
          this.originalCategories=this.categories;
          // if( this.categories.length==9)
          // this.length=true;
          // return this.categories.length;
      //  }
        
    
     })

   }

getAllBooks=function(){

       console.log("in get all books")
      this.search.getAllBooks(this.token).subscribe(data =>{
       this.Books=data,
       error => console.log(error),

       this.categorisedBooks=this.Books;
       console.log("heloooooooooooooo",this.Books)
       
   })
   }
getItems=function(ev) {
    // Reset items back to all of the items
    this.showSlides=false;
    // console.log("Bookssssssssss",this.Books)
    this.categorisedBooks=this.Books;
    console.log("Hmmmmmmmmmm"+this.categorisedBooks);
    // set val to the value of the ev target
    var val = ev;

    // if the value is an empty string don't filter the items
    if (val && val != ' ') {
      if(this.selectAuthor==true)
      {
           this.categorisedBooks = this.categorisedBooks.filter((item) => {
      return(item.authors.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      }
      else if  (this.selectTitle==true)
      {
           this.categorisedBooks = this.categorisedBooks.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      }
   
    }
    // val='';
  }
setTitle=function(){
    this.selectTitle=true;
    this.selectAuthor=false;
    this.selectPublisher=false;
    // console.log("titleeeeeeeeeeeeeeeeeeeeeee")
  }
  setAuthor=function(){
    this.selectTitle=false;
    this.selectAuthor=true;
    this.selectPublisher=false;
    // console.log("authorrrrrrrrrrrrrrrrrrr")
  }
  goBackToCategories=function(){
  this.showSlides=true;
 
  // console.log("iiiiiiiiiii");
}
 getByCategory=function(category){
     this.showSlides=false
      console.log("in get by Categories")
     this.search.getByCategory(category,this.token).subscribe(data =>{
       console.log("coming data",data);
       for(let f=0;f<data.length;f++)
       this.categorisedBooks.push(data[f]);
       console.log("cattttttttttttttt",this.categorisedBooks)

   })
   }
showDetailView=function(book){
  // this.book=this.categorisedBooks[index];
  this.book=book;
  console.log("Book title"+this.book.title);
  this.getBook.putBook(this.book);
  
  // console.log("index",index);
  // console.log("book is",this.book)
this.nav.push(DetailViewPage); 
// this.nav.push(DetailViewPage);
  }
 
presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(CategoriesPage,this.categories,{cssClass:"categoriesPopover"});
    popover.onDidDismiss(data => {
     console.log('test1---------->');
     console.log(data);
     
     if(data!=null){
       this.categorisedBooks=[];
         for(let k=0;k<data.length;k++){
       if(data[k].flag==true)
       this.getByCategory(data[k].Title);
       console.log("aaaa",this.categorisedBooks)
     }
     }
     if(data==null){
      //  console.log("hyyyy",this.originalCategories)
      //  this.categories=this.originalCategories;
      this.getCategories();
     }
    //    if(!data){
    //   //  console.log("hyyyy",this.originalCategories)
    //   //  this.categories=this.originalCategories;
    //   this.getCategories();
    //  }
     
 
   });
    popover.present({
      ev: myEvent
    });
  }
presentLoading() { 
  let loader = this.loadingCtrl.create({ content: "Getting All Books...", duration: 2000 });
   loader.present(); 
} 
  ngOnInit(){
    this.presentLoading();
   this.getCategories();
  // console.log(this.loaded);
   this.getAllBooks();
    this.showSearch=true;
    console.log("Categoriesed Boooksss"+ this.categorisedBooks);
   if(this.navParams.get('flag')){
this.showSearch=this.navParams.get('flag');
console.log("in navparamssssss",this.showSearch);

        }




  //  console.log("serach------------");
   this.searchInput="";
    setTimeout(() => {
       this.loaded = true;
     }, 2500);

  }
  }


