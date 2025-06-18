import { Fragment, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react';
import { useSearchBoardsQuery } from '../redux/boardsApi';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import type { IBoard } from '../types';

const SearchBoard = () => {
  const [query, setQuery] = useState('');
  const {
    data: boards = [],
    isLoading,
    isError,
  } = useSearchBoardsQuery(query, { skip: !query });
  const navigate = useNavigate();

  return (
    <Combobox onChange={(board: IBoard) => navigate(`/boards/${board._id}`)}>
      <div className='relative'>
        <div className='flex gap-2'>
          <ComboboxInput
            className='flex-1 p-5 text-xl border rounded-2xl focus:outline-none'
            placeholder='Enter a board ID or Title here…'
            onChange={(e) => setQuery(e.currentTarget.value)}
            displayValue={(b: IBoard) => b?.title || b?._id || ''}
          />
          <ComboboxButton className='px-10 py-2 bg-green-600 hover:bg-white text-white hover:text-black hover:border-1 text-xl rounded-2xl disabled:opacity-50'>
            {isLoading ? <Loader size={20} /> : 'Load'}
          </ComboboxButton>
        </div>

        {isError && <p className='text-red-500 mt-1'>Search mistake</p>}

        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <ComboboxOptions className='absolute mt-1 w-full bg-white border rounded max-h-60 overflow-auto z-20'>
            {boards.length === 0 && query !== '' ? (
              <div className='p-2 text-gray-500'>
                No boards found, try another search
              </div>
            ) : (
              boards.map((board) => (
                <ComboboxOption
                  key={board._id}
                  value={board}
                  className={({ focus }) =>
                    `cursor-pointer select-none px-3 py-2 ${
                      focus ? 'bg-blue-100' : ''
                    }`
                  }
                >
                  <div className='flex justify-between'>
                    <span>{board.title}</span>
                    <span className='text-sm text-gray-500'>{board._id}</span>
                  </div>
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SearchBoard;
