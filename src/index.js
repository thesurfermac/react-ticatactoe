import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/*
TODO
Bold the currently selected item in the move list.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
When no one wins, display a message about the result being a draw.
*/
class Square extends React.Component{
  constructor(props){
    super(props);
    this.props = props;
    this.state = {
      className: props.className
    }
    
  }
  render(){
    return (
      <button className={this.props.className} onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }

}

  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          className={this.props.classNames[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            classNames: Array(9).fill('square')
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        rowNumber: 0,
        colNumber: 0,
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const classNames = Array(9).fill('square');
      classNames[i] = 'highlited';
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const rowNumber =Math.ceil (i / 3);
      const colNumber = i % 3;
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            classNames: classNames
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        rowNumber: rowNumber,
        colNumber: colNumber
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

    sortValues(){
      const reverse = this.state.history.reverse();
      this.setState({
        history: reverse,
      });

    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner[0];
        for(let val of winner[1]){
          current.classNames[val] = 'highlited';
        }
        
      } else {
        if(this.state.stepNumber === 9){
          status = "The game is a draw";
        }
        else{

          status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
      }

      const rowNumber = this.state.rowNumber;
      const colNumber = this.state.colNumber;
      const sortValues = this.sortValues;
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              classNames={current.classNames}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={sortValues}>sort</button>
            <ol>{moves}</ol>
      <span>{colNumber},{rowNumber}</span>
          </div>
        </div>
      );
    }
  }
  
  // ========================================

class ProductSearchBar extends React.Component{
  render(){
    return (
      <div>
        <input type='text' /><br/>
        <input type='checkbox' />Only Show Products in Stock
      </div>
    );
  }

}

class ProductRow extends React.Component{
  constructor(props){
    super(props);
    this.props = props;
  }
  render(){
    return (
      <div>
        {this.props.name}  {this.props.price}
      </div>
    );
  }
}
class ProductTable extends React.Component{
  constructor(props){
    super(props);
    this.props = props;
  }

  render(){
    const items = this.props.items;

    const itemRows = items.map(item =>{return <ProductRow name={item.name} price={item.price} />})
    return (
      <div>

        {itemRows}
      </div>
    );
  }
}

class FilterableProductTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: [
        {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
        {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
        {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
        {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
        {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
        {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
      ]
    }

  }
  render(){
    const items = this.state.items;
    return(
      <div>
      <ProductSearchBar/>
      <ProductTable items={items}/>
      </div>);
  }

}



  //=========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  ReactDOM.render(<FilterableProductTable />, document.getElementById("react-thinking"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      }
    }
    return null;
  }
  