import styled from 'styled-components'

const Wrapper = styled.section`

  display: flex;
  flex-direction: column;
  text-align: center;
  
    input{
      width: 100%
    };
    ul{
      margin: 0;
      padding: 0;
    }
    li{
      list-style-type: none;
      display: flex;
      flex-direction: column;
      h4{
        text-decoration:underline;
      }
    };

  @media all and (min-width: 700px){
    margin: 0 30% 0 30%
  }  
`
const LearningSection = styled.section`
  display: flex;
  flex-direction: column;

  .word{
    text-align: center;
  }

`





export  { Wrapper, LearningSection}

