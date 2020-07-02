var tableId = document.getElementById("table");
var resultstatus=document.getElementById("result");
var notifacationStatus = document.getElementById("notification");
var jcell;
var player=0;
var number;
var gameOver = 0;
var opponent = "X";		//human
var Ai_player = "O";		//AI
var MAX_DEPTH;
var infinite = 1000000000;
var m_infinite = -1000000000;
var roww = [];
var coll = [];
var maindig;
var othdig;
var row1 = [];
var col1 = [];
var maindig1;
var othdig1;
//var flag=0;

function generateFields() 
{
	var input = document.getElementById("input").value;
	number = Number(input);  
	MAX_DEPTH = number*number;		// CHANGE THIS VALUE TO ADD DIFFICULTY LEVEL!!!  
	
	for(var i=0;i<number;i++)
	{
		roww.push(0);
		coll.push(0);
	}
	maindig = 0;
	othdig = 0;

	jcell = new Array(number);

	for (var i = 0; i < number; i++) 
	{
		jcell[i] = new Array(number);
		var newTR = document.createElement('tr');
		
		for(var j=0;j<number;j++) 
		{
			var newTD = document.createElement('td');
			jcell[i][j] = newTD;
			newTD.classList.add('cell');
			newTD.style.width="50px";
			newTD.style.height="50px";
			newTD.innerHTML="";
			newTD.dataset.row = i;
			newTD.dataset.col = j;
			newTD.addEventListener('click',handleClick);
			newTR.appendChild(newTD);

		}
		tableId.appendChild(newTR);
	}
}

function handleClick(e)
{
	var i=e.target.dataset.row;
	var j=e.target.dataset.col;
	if(is_valid_move(i,j))
	{
		if(player%2==0)	{	
			jcell[i][j].innerHTML = "X";	roww[i]--;	coll[j]--;
			if(i == j)
				maindig--;
			if((i+j+1) == number)
				othdig--;	
		}		
		else	{   		
			jcell[i][j].innerHTML = "O";	roww[i]++;	coll[j]++;
			if(i == j)	maindig++;
			if((i+j+1) == number)	othdig++;	
		}
		player++;
		checkwinner();
		if(gameOver == 1)
			return;
		console.log("human : " + i + " " + j + " " + maindig + " " + othdig);
		var AI_move = AI_turn();
		i = Math.floor(AI_move/number);
		j = Math.floor(AI_move%number);
		if(player%2==0)	{	
			jcell[i][j].innerHTML = "X";	roww[i]--;	coll[j]--;	
			if(i == j)	maindig--;
			if((i+j+1) == number)	othdig--;
		}		
		else	{   		
			jcell[i][j].innerHTML = "O";	roww[i]++;	coll[j]++;	
			if(i == j)	maindig++;
			if((i+j+1) == number)	othdig++;
		}
		console.log("AI : " + i + " " + j + " " + maindig + " " + othdig);

		player++;
		checkwinner();
	}
}

function is_valid_move(i,j)
{
	if(jcell[i][j].innerHTML == "")
	{
		return true;
	}
	else
	{
		notifacationStatus.innerHTML = "You can't take this move!! as it's already taken...";
		return false;
	}
}

function checkwinner()
{
	if(maindig == number || othdig == number)
	{
		resultstatus.innerHTML="O won";
		gameOver = 1;
	}
	else if(maindig == -number || othdig == -number)
	{
		resultstatus.innerHTML="X won";
		gameOver = 1;
	}
	for(var i=0;i<number;i++)
	{
		if(roww[i] == number || coll[i] == number)
		{	
			resultstatus.innerHTML="O won";
			gameOver = 1;
		}
		else if(roww[i] == -number || coll[i] == -number)
		{
			resultstatus.innerHTML="X won";
			gameOver = 1;
		}
	}
	if(player == number*number)
	{
		resultstatus.innerHTML="It's Tie";
		gameOver = 1;
	}
}

function AI_turn()
{
 	var board = [];
	for(var i=0;i<number;i++)
	{
		for(var j=0;j<number;j++)
		{
			if(jcell[i][j].innerHTML=="X")
			{	board.push(1);	}
			else if(jcell[i][j].innerHTML=="O")
			{	board.push(-1);	}
			else
			{	board.push(0);	}
		}
	}

	var bestMove = -1;
	var bestVal = -1000;
	for(var i=0;i<number;i++)
	{
		for(var j=0;j<number;j++)
		{
			if(board[i*number + j] == 0)
			{
				board[i*number + j] = -1;
				var moveVal = (-1)*(NegaMax(board,0,0,m_infinite,infinite));		//0 for human and 1 for AI(computer)...
				board[i*number + j] = 0;
				if (moveVal > bestVal)
                {
					bestMove = i*number + j;
                    bestVal = moveVal;
                }
			}
		}
	}
	return bestMove;
}

function NegaMax(board,depth,pid,alpha,beta)
{
	var score = Evaluate(board);
	if (score == 100 && pid == 0)
		return -10;
	else if(score == 100 && pid == 1)
		return 10;
	if (score == -100 && pid == 0)
		return 10;
	else if(score == -100 && pid == 1)
		return -10;

	if(depth>MAX_DEPTH)
	{
		return 0;
	}
	if (isMovesLeft(board)==false)
		return 0;
	
	var best = m_infinite;
	for (var i = 0; i<number; i++)
	{
		for (var j = 0; j<number; j++)
		{
			if (board[number*i + j]==0)
			{
				if(pid == 0)
					board[number*i + j] = 1;
				else
					board[number*i + j] = -1;
				var x = (-1)*NegaMax(board, depth+1,  (pid+1)%2,(-1)*beta,(-1)*alpha);
				best = Math.max( best , x);
                board[number*i + j] = 0;
                if(x>alpha)
				{
					alpha = x;
				}
				if(alpha>=beta)
				{
					return alpha;
				}
			}
		}
	}
	return best;
}

function Evaluate(board)
{
	var ld=0;
	var rd=0;
	var scr;

	//For rows check
	for(var i=0;i<number;i++)
	{
		var cnt=0;
		for(var j=0;j<number;j++)
		{
			if(board[i*number + j]==1)
				cnt--;
			else if(board[i*number + j]==-1)
				cnt++;
		}
		scr = evalResult(cnt);
		if(scr == 1 || scr == -1)
		{
			return (100*scr);
		}
	}

	// For columns check
	for(var j=0;j<number;j++)
	{
		var cnt=0;
		for(var i=0;i<number;i++)
		{
			if(board[i*number + j]==1)
			{
				cnt--;
			}
			else if(board[i*number + j]==-1)
			{
				cnt++;
			}
		}
		scr = evalResult(cnt);
		if(scr == 1 || scr == -1)
		{
			return (100*scr);
		}
	}

	//For main-digonal check
	for(var i=0;i<number;i++){
		if(board[i*number + i]==1)
		{
			ld--;
		}
		else if(board[i*number + i]==-1)
		{
			ld++;
		}
	}
		
	//For other digonal check
	for(var i=0;i<number;i++){
		if(board[(number-1-i)*(number) + i] == 1)
		{
			rd--;
		}
		else if(board[(number-1-i)*(number) + i] == -1)
		{
			rd++;
		}
	}	
	
	scr = evalResult(ld);
	if(scr == 1 || scr == -1){	return	(100*scr);	}
	scr = evalResult(rd);
	if(scr == 1 || scr == -1){	return (100*scr);	}

	return 0;

}

function evalResult(cnt)
{
	if(cnt==number)	{	return 1;	}
	if(cnt==(-number)){	return -1;	}
	return 0;
}

function isMovesLeft(board)
{
    for (var i = 0; i<number; i++)
        for (var j = 0; j<number; j++)
			if (board[number*i + j]==0)
                return true;
    return false;
}