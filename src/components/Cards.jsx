import React from 'react';
import Skills from "./Skills";
import Card from "react-bootstrap/Card";

const Cards = () => {
  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
      {Skills.map((skill, index) => {
        return (
          <Card key={`${index}${skill.title}`}
                data-testid={'CardSkill'}
                id={'CardSkill'}
                title={'Card Skills'}>
            <div
              className={'w-full h-full dark:bg-gray-800 dark:text-white'}>
              <div
                className={'space-x-4 rounded-lg md:p-8 transition-all dark:bg-gray-900 dark:border dark:border-gray-800 shadow-xl shadow-cyan-600/20 dark:shadow-lg dark:shadow-cyan-600/30 dark:text-white-400 border-2 border-transparent hover:border-current4'}>
                <div className={'flex card-header pb-8'}>
                  <div className={'p-3 text-center align-middle'}>
                    <div className={'m-1'}>
                      {skill.icon !== null ? skill.icon : ''}
                      <h1 className={'font-extrabold font-burtons'}>
                        {skill.title}
                      </h1>
                    </div>
                  </div>
                </div>
                <div style={{paddingTop: '20px', height: '250px'}}>
                  {skill.description}
                </div>
                <div>
                  {skill.link.map((x, index) => {
                    return (
                      <div
                        key={`${index}${x.name}`}
                        className={'flex items-center justify-start space-x-4 border-t border-gray-200"'}
                      >
                        <a
                          href={x.url}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {x.name}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  )
};

export default Cards;
