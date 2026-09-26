import { render, screen } from '@testing-library/react-native';
import { JmuView } from '../JmuView';

it('renders headings, paragraphs and list items from JMU', async () => {
  await render(<JmuView jmu={'## The ruling\n\nFasting is **obligatory**.\n\n- First point'} />);
  expect(screen.getByText('The ruling')).toBeTruthy();
  expect(screen.getByText(/Fasting is/)).toBeTruthy();
  expect(screen.getByText('First point')).toBeTruthy();
});
