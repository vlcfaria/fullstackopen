const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ total }) => <p>Number of exercises {total}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map((part) => <Part key={part.id} part={part} />)}
  </>

const Course = ({courses}) => {
  return (
    <>
      {courses.map((course) => (
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total total={course.parts.reduce((acc, part) => acc + part.exercises, 0)} />
        </div>
      ))}
    </>
  )
}

export default Course