import logo from './logo.svg';
import {useState, useEffect, Fragment} from 'react';
import './App.css';
import leetcode_data from './leetcode_problems.json';
import {Box, Card, CardContent, Container, Grid, Button, Typography} from '@mui/material';
import {useConfirm} from 'material-ui-confirm';

function App() {

  const [easy, setEasy] = useState();
  const [medium, setMedium] = useState();
  const [hard, setHard] = useState();
  const [fastQueue, setFast] = useState();
  const [slowQueue, setSlow] = useState();
  const [loaded, setLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const confirm = useConfirm()

  function random_sort(a, b){
    return Math.random() - 0.5
  }

  function load_from_local(){
    setEasy(JSON.parse(localStorage.getItem('easy')))
    setMedium(JSON.parse(localStorage.getItem('medium')))
    setHard(JSON.parse(localStorage.getItem('hard')))
    setFast(JSON.parse(localStorage.getItem('fast')))
    setSlow(JSON.parse(localStorage.getItem('slow')))
    setIsEmpty(localStorage.getItem('is_empty') == 'true' || localStorage.getItem('is_empty') == true)
    setLoaded(true)
  }

  function delete_all_data(){
    confirm({description: 'Delete all data?'})
    .then(() => {
      localStorage.clear()
      window.location.reload()
    })
  }

  function load_next_problem(){
    if(easy.length > 0){
      return leetcode_data['all_problems'][easy[0]]
    }else if(medium.length > 0){
      return leetcode_data['all_problems'][medium[0]]
    }else if(hard.length > 0){
      return leetcode_data['all_problems'][hard[0]]
    }else{
      return null
    }
  }

  function NextProblem(){
    const [value, setValue] = useState()
    const finished_problem = (id, data, setter, queue, queue_setter) => {
      confirm({description: 'Confirm the problem is finished?'})
      .then(() => {
        data.shift()
        if(setter != 'slow' || queue_setter != 'slow'){
          queue.push(String(id))
        }else{
          setIsEmpty(slowQueue.length == 0)
          localStorage.setItem('is_empty', slowQueue.length == 0)
        }
        localStorage.setItem(setter,JSON.stringify(data))
        localStorage.setItem(queue_setter,JSON.stringify(queue))
        setValue({})
      })
    }
    let problem = load_next_problem()
    let data = null
    let setter = null
    let problem_id = null
    if(problem === null){
      if(fastQueue.length > 0){
        problem = leetcode_data['all_problems'][fastQueue[0]]
        data = fastQueue 
        setter = 'fast'
      }else if(slowQueue.length > 0){
        problem = leetcode_data['all_problems'][slowQueue[0]]
        data = slowQueue 
        setter = 'slow'
      }
      problem_id = problem['id']
    }else{
      problem_id = problem['id']
      if(problem['difficulty'] == 0){
        data = easy
        setter = 'easy'
      }else if(problem['difficulty'] == 1){
        data = medium
        setter = 'medium' 
      }else if(problem['difficulty'] == 2){
        data = hard
        setter = 'hard'
      }
    }
    return (
      <Card>
        <CardContent>
          <Container>
            <Typography>
              Current Problem
            </Typography>
            {problem['name']}
            <Box my={2}/>
            <Grid container>
              <Grid item xs={12} md={4}>
                <Button onClick={() => finished_problem(problem_id, data, setter, slowQueue, 'slow')} variant='contained'>Solved</Button> 
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant='contained' target='_blank' rel='noopener' href={problem['url']}>Go To Problem</Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button onClick={() => finished_problem(problem_id, data, setter, fastQueue, 'fast')} variant='contained'>Unsolved</Button> 
              </Grid>
            </Grid>
          </Container>
        </CardContent>
      </Card>
    )

  }
  useEffect(() => {
    if(localStorage.getItem('data_exists') === null){
      localStorage.setItem('fast',JSON.stringify([]))
      localStorage.setItem('slow',JSON.stringify([]))
      let easyProblems = leetcode_data['easy'].sort(random_sort)
      let mediumProblems = leetcode_data['medium'].sort(random_sort)
      let hardProblems = leetcode_data['hard'].sort(random_sort)
      localStorage.setItem('easy',JSON.stringify(easyProblems))
      localStorage.setItem('medium',JSON.stringify(mediumProblems))
      localStorage.setItem('hard',JSON.stringify(hardProblems))
      localStorage.setItem('data_exists',true)
      localStorage.setItem('is_empty', false)
    }
    load_from_local()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {loaded && 
        <Fragment>
          {isEmpty ?
          <div>
            Good job! You finished the whole list.
          </div>
          :
          <Fragment>
            <NextProblem/>
            <Box my={2}/>
            <Card>
              <CardContent>
                <Container>
                  <Grid container>
                    <Grid item xs={12} md={8}>
                      <Button href='https://seanprashad.com/leetcode-patterns/' target='_blank' variant="outlined">seanprashad.com/leetcode-patterns</Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button onClick={delete_all_data} variant="outlined">Delete All Data</Button>
                    </Grid>
                  </Grid>
                </Container>
              </CardContent>
            </Card>
          </Fragment>
          }
        </Fragment>
        }
      </header>
    </div>
  );
}

export default App;
