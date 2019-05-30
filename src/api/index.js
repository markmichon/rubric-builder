const rubricData = {
  headings: [
    'Topic',
    'Weight',
    'Excellent (100%)',
    'Good (75%)',
    'Fair (30%)',
    'Poor (0%)',
  ],
  topics: [
    {
      name: 'Development Environment',
      weight: '5',
      id: '0912797368123470239874',
      options: [
        {
          id: '12398172397126487612',
          weight: 100,
          disabled: false,
          description:
            'The development environment is set up and working completely using a task runner, such as gulp, a gitignore file with all unneeded files ignored, and can be duplicated via the readme instructions.',
        },
        {
          id: '329384710287312',
          weight: 75,
          description: '',
          disabled: true,
        },
        {
          id: '761253871283r791',
          weight: 30,
          description: '',
          disabled: true,
        },
        {
          id: '43583475983474324',
          weight: 0,
          disabled: false,
          description:
            'The development environment is not working correctly and fails to meet the noted criteria.',
        },
      ],
    },
    {
      name: 'CSS Preprocessors',
      weight: 10,
      id: '01827397263907123',
      options: [
        {
          id: '3457698437201273',
          weight: 100,
          disabled: false,
          description:
            'Demonstrates an excellent understanding of CSS Preprocessors and misses zero requirements from the assignment. See assignment for grading guidelines.',
        },
        {
          id: '120485746756412947234',
          weight: 75,
          disabled: false,
          description:
            'Assignment demonstrates proficiency in CSS Preprocessors. (minor problems or mistakes)',
        },
        {
          id: '1238387r618249813y01874214',
          weight: 30,
          disabled: false,
          description:
            'Assignment demonstrates general understanding of CSS Preprocessors. (considerable problems or mistakes)',
        },
        {
          id: '0138641278947018241028473412e2',
          weight: 0,
          disabled: false,
          description:
            'Assignment fails to demonstrate sufficient understanding of CSS Preprocessors. (major problems or mistakes)',
        },
      ],
    },
    {
      name: 'API Usage',
      weight: '5',
      id: '5081724087120348712037124',
      options: [
        {
          id: '458374507463974610872',
          weight: 100,
          disabled: false,
          description:
            'The development environment is set up and working completely using a task runner, such as gulp, a gitignore file with all unneeded files ignored, and can be duplicated via the readme instructions.',
        },
        {
          id: '182376832476913874',
          weight: 75,
          description: 'blah blah test',
          disabled: false,
        },
        {
          id: '45083764928o374961381',
          weight: 30,
          description: 'blah blah blah blah test',
          disabled: false,
        },
        {
          id: '916843906419386981367408314',
          weight: 0,
          disabled: false,
          description:
            'The development environment is not working correctly and fails to meet the noted criteria.',
        },
      ],
    },
  ],
}

export function getRubric() {
  return rubricData
}
