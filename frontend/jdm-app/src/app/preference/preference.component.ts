import { Component, OnInit } from '@angular/core';

// Services
import { WordService } from '../word.service';

// Models
import { ResWord } from '../resWord';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {

  constructor(private wordService: WordService) { }

  ngOnInit() {
    this.getWord('singe');
  }

  getWord(word: string): void {
    this.wordService.getWord(word)
      .subscribe(resWord => console.log(resWord));
  }

}
