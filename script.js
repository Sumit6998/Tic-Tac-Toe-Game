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
var total_move;
var round = 0;

function generateFields() 
{
	var input = document.getElementById("input").value;
	number = Number(input);  
	if(number==3)
		MAX_DEPTH = number*number;
	else if(number<=6)
		MAX_DEPTH = number/2;		// CHANGE THIS VALUE TO ADD DIFFICULTY LEVEL!!!  
	else
		MAX_DEPTH = 3;
	for(var i=0;i<number;i++)
	{
		roww.push(0);
		row1.push(0);
		coll.push(0);
		col1.push(0);
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
	if(gameOver == 0 && player == number*number)
	{
		resultstatus.innerHTML="It's Tie";
		gameOver = 1;
	}
}

function AI_turn()
{
	for(var i=0;i<number;i++)
	{
		row1[i] = 0;
		col1[i] = 0;
	}
	maindig1 = 0;
	othdig1 = 0;
	total_move = 0;

	//Making the board and initializing it...
	 var board = [];
	 for(var i=0;i<number;i++)
	{
		for(var j=0;j<number;j++)
		{
			if(jcell[i][j].innerHTML=="X")
			{	
				row1[i]--;	col1[j]--;
				if(i == j)
					maindig1--;
				if((i+j+1) == number)
					othdig1--;
			}
			else if(jcell[i][j].innerHTML=="O")
			{	
				row1[i]++;	col1[j]++;
				if(i == j)
					maindig1++;
				if((i+j+1) == number)
					othdig1++;
			}
			else
			{	
				board.push(i*number + j);	
			}
		}
	}
	
	var bestMove = -1;
	var bestVal = -1000;

	
	for(var k=0;k<board.length;k++)
	{
		var tmp_board = board.slice();
		var first = tmp_board.shift();
		var i = Math.floor(first/number);
		var j = Math.floor(first%number);
		row1[i]++;	col1[j]++;
		if(i == j)
			maindig1++;
		if((i+j+1) == number)
			othdig1++;
		var moveVal = (-1)*(NegaMax(tmp_board,0,0,m_infinite,infinite));		//0 for human and 1 for AI(computer)...
		row1[i]--;	col1[j]--;
		if(i == j)
			maindig1--;
		if((i+j+1) == number)
			othdig1--;
		total_move--;
		if (moveVal > bestVal)
		{
			bestMove = first;	
			bestVal = moveVal;
		}
		first = board.shift();
		board.push(first);
	}

	return bestMove;
}

function NegaMax(tmp_board,depth,pid,alpha,beta)
{
	var score = Evaluate();
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
	if(tmp_board.length == 0)
		return 0;

	var best = m_infinite;
	var tmp_len = tmp_board.length;
	for(var k=0;k<tmp_len;k++)
	{
		var ttt_board = tmp_board.slice();
		var first = ttt_board.shift();
		var i = Math.floor(first/number);
		var j = Math.floor(first%number);
		if(pid == 0)
		{
			row1[i]--;	col1[j]--;
			if(i == j)
				maindig1--;
			if((i+j+1) == number)
				othdig1--;
		}
		else
		{
			row1[i]++;	col1[j]++;
			if(i == j)
				maindig1++;
			if((i+j+1) == number)
				othdig1++;
		}
		var x = (-1)*NegaMax(ttt_board, depth+1,  (pid+1)%2,(-1)*beta,(-1)*alpha);
		best = Math.max( best , x);
		if(pid == 0)
		{
			row1[i]++;	col1[j]++;
			if(i == j)
				maindig1++;
			if((i+j+1) == number)
				othdig1++;
			total_move--;
		}
		else
		{
			row1[i]--;	col1[j]--;
			if(i == j)
				maindig1--;
			if((i+j+1) == number)
				othdig1--;
			total_move--;
		}
		first = tmp_board.shift();
		tmp_board.push(first);
				
		if(x>alpha)
		{
			alpha = x;
		}
		if(alpha>=beta)
		{
			return alpha;
		}
		round++;
	}

	return best;
}

function Evaluate()
{
	if(maindig1 == number || othdig1 == number)
	{
		return 100;
	}
	else if(maindig1 == -number || othdig1 == -number)
	{
		return -100;
	}
	for(var i=0;i<number;i++)
	{
		if(row1[i] == number || col1[i] == number)
		{	
			return(100);
		}
		else if(row1[i] == -number || col1[i] == -number)
		{
			return(-100);
		}
	}
	
	return 0;

}
