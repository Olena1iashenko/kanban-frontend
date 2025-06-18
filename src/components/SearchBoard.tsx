import { Fragment, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react';
import {
  useCreateBoardMutation,
  useSearchBoardsQuery,
} from '../redux/boardsApi';
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
  const [createBoard, { isLoading: creating }] = useCreateBoardMutation();
  const navigate = useNavigate();

  const handleSelect = async (board: IBoard | { create: true }) => {
    if ('create' in board && board.create) {
      const newBoard = await createBoard({ title: query }).unwrap();
      navigate(`/boards/${newBoard._id}`);
    } else {
      navigate(`/boards/${(board as IBoard)._id}`);
    }
  };

  return (
    <Combobox onChange={handleSelect}>
      <div className='relative'>
        <div className='flex gap-2'>
          <ComboboxInput
            className='flex-1 p-5 text-xl border rounded-2xl focus:outline-none'
            placeholder='Enter a board ID or Title here…'
            onChange={(e) => setQuery(e.currentTarget.value)}
            displayValue={(b: IBoard) => b?.title || b?._id || ''}
          />
          <ComboboxButton className='px-10 py-2 bg-green-600 hover:bg-white text-white hover:text-black hover:border-1 text-xl rounded-2xl disabled:opacity-50'>
            {isLoading || creating ? <Loader size={20} /> : 'Load'}
          </ComboboxButton>
        </div>

        {isError && <p className='text-red-500 mt-1'>Search mistake</p>}

        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <ComboboxOptions className='absolute mt-1 w-full bg-white rounded max-h-60 overflow-auto z-20'>
            {query !== '' && boards.length === 0 ? (
              <ComboboxOption
                value={{ create: true }}
                className={({ active }) =>
                  `cursor-pointer select-none px-3 py-2 ${
                    active ? 'bg-blue-100' : ''
                  }`
                }
              >
                Create new board “{query}”
              </ComboboxOption>
            ) : (
              boards.map((board) => (
                <ComboboxOption
                  key={board._id}
                  value={board}
                  className={({ active }) =>
                    `cursor-pointer select-none px-3 py-2 ${
                      active ? 'bg-blue-100' : ''
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
