import React, { Component } from 'react';

export default class Questions extends Component {
 
  constructor() {
    super();
    this.next=this.next.bind(this)
    this.prev=this.prev.bind(this)
    this.checkAnswer=this.checkAnswer.bind(this)
    this.state = {
      points: 0,
      questionKey:0,
    };
  }

  checkAnswer(e){
     this.setState({
       questions:{
         ...this.state.questions,
         [this.state.questionKey]:{
           ...this.state.questions[this.state.questionKey],
           userAnswer:e.target.value
         }
       }
     })
  }

  calcPoints(){
    const point=this.state.questions.length/100
    let totalPoints=0;
    console.log(this.state.questions)
    for(let i=0;i<this.state.questions.length;i++){
      console.log(this.state.questions[i].correct_answer)
    }
    
  }

  buttonsHandler(){
    this.state.questionKey<=0?this.setState({prev:false}):this.setState({prev:true})
    this.state.questionKey>=this.state.questions.length-1
      ?this.setState({done:true})
      :this.setState({done:false})
  }

  next(){
    this.setState((prevState) => ({
       questionKey: prevState.questionKey + 1
    }),e=>{
      this.buttonsHandler()
      this.calcPoints()
    }); 
  }

  prev(){
    this.setState((prevState) => ({
       questionKey: prevState.questionKey - 1
    }),e=>{
      this.buttonsHandler()
    }); 
  }

  componentWillMount() {
    fetch('https://opentdb.com/api.php?amount=4')
      .then(response => response.json())
      .then(data => this.setState({ questions:data.results }))
      .then(()=>{ 
        this.buttonsHandler()
      }
      )
  }

  render() {
    const {questions,questionKey} = this.state
    if(questions && questions[questionKey]){
      const q=questions[questionKey]
      const answers=[...q.incorrect_answers,...q.correct_answer]
        
    }

    return (
      <div>
        { q ?
        <form>
          <p>{q.question}</p>
          {answers.map((answer,index)=>{
            let checked=false
            if(this.state.questions[this.state.questionKey].userAnswer &&
            this.state.questions[this.state.questionKey].userAnswer === answer){
              checked=true
            }
            return (
             <label  key={index} >
        <input checked={checked} onChange={this.checkAnswer} name="answers" type="radio" value={answer} />
        {answer}<br/>
      </label>
            )
            }
            )}
        </form>
          :"loading"}
       {this.state.prev &&<button onClick={this.prev}>prev</button>}
       <button onClick={this.next}>{this.state.done?"done":"next"}</button>
      </div>
    );
  }
}
