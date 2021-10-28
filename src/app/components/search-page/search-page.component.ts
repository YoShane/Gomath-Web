import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpsService } from './../../services/https.service';
export interface a {
  wrong: string;
  correct: any;
  write: any;
  writeorwrong: any;
  picture: any;
}
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  image: any = 'data:image/png;base64,'
  dataSource: any = [];
  change: any = ''
  changeArray: any = []
  ELE: a[] = []
  feedbackId: any = [];
  answer: any = []
  displayedColumns: any = ['錯的題目', '正解', '題目辨識手寫結果', '下拉式選單修正對錯', '題目手寫圖片']
  constructor(private route: ActivatedRoute,
    private HttpsService: HttpsService) { }

  ngOnInit(): void {
    this.getStudent()
  }
  getStudent() {
    var ans = ''
    this.HttpsService.getSearch("studentId=" + this.route.snapshot.paramMap.get('id')!).subscribe((res: any) => {
      console.log(res)
      res.forEach((element: any) => {
        this.feedbackId.push(element.feedbackId)
        this.answer.push(element.answer)
        if (element.answer == '' || element.answer == null) {
          ans = '無作答'
        } else if (element.answer == '1') {
          ans = '1'
        } else if (element.answer == '2') {
          ans = '2'
        }
        else if (element.answer == '3') {
          ans = '3'
        } else if (element.answer == '4') {
          ans = '4'
        }
        var datas = {
          wrong: element.topicId,
          correct: element.topicAnswer,
          write: ans,
          writeorwrong: '1',
          picture: element.image
        }
        this.ELE.push(datas)
      });
      this.dataSource = this.ELE
      this.changeArray.length = this.dataSource.length
      for (var i = 0; i < this.changeArray.length; i++) {
        this.changeArray[i] = 1
      }
      //this.datas = res
    })
  }
  submit() {
    console.log(this.feedbackId)
    console.log(this.changeArray)
    for (var i = 0; i < this.changeArray.length; i++) {
      if (this.changeArray[i] != this.answer[i]) {
        var sub = [{
          "path": "/answer",
          "op": "replace",
          "value": this.changeArray[i]
        }]
        this.HttpsService.updateFeedback(sub, this.feedbackId[i]).subscribe((res: any) => {
          console.log(res)
        })
      }
    }

  }
}
