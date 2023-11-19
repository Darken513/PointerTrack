import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-code-key-input',
  templateUrl: './code-key-input.component.html',
  styleUrls: ['./code-key-input.component.scss']
})
export class CodeKeyInputComponent {
  digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  enteredCode = '';

  @Output() onEvent = new EventEmitter<any>();
  public sendMsg(){
    if(this.enteredCode.length > 2){
      this.onEvent.emit(this.enteredCode)
    }
  }

  onDigitClick(digit: number): void {
    if(this.enteredCode.length < 4){
      this.enteredCode += digit.toString();
    }
  }

  onActionClick(event: string): void {
    if(event == 'resetOne'){
      if(this.enteredCode.length)
        this.enteredCode = this.enteredCode.slice(0, -1);
    }else if(event == 'resetAll'){
      this.enteredCode  = '';
    }
  }
  
}
