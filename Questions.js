import React, { Component } from 'react';

export default class Questions extends Component {
 
  constructor() {
    super();
    this.next=this.next.bind(this)
    this.prev=this.prev.bind(this)
    this.checkAnswer=this.checkAnswer.bind(this)
    this.state = {
      points: null,
      questionKey:0,
    };
  }

  checkAnswer(e){
    e.persist()
     this.setState(state=>{
       let q=state.questions
          q[state.questionKey]["userAnswer"]=e.target.value
       return {question:q}
     })
  }


  calcPoints(){
    const point=100/this.state.questions.length
    let totalPoints=0;
    this.setState({points:0})
    this.state.questions.map((q)=>{
      if(q.userAnswer && q.userAnswer === q.correct_answer){
         totalPoints+=point
         this.setState({points:totalPoints})
      }
    })
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
          :this.state.points?this.state.points+" points":"loading"}
       {this.state.questions && this.state.questionKey<this.state.questions.length &&<div>
       {this.state.prev &&
       <button onClick={this.prev}>prev</button>}
       <button onClick={this.next}>{this.state.done?"done":"next"}</button>
       </div>}
      </div>
    );
  }
}
