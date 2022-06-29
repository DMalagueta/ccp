import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  media: {
    width: "15%",
    objectFit: "cover",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  buttons: {
    display: "flex",
    alignItems: "center",
  },
  cartitem: {
    display: "flex",
    justifyContent: "flex-end",
  },
  content: {
    position: "relative",
    justifyContent: "flex-end",
    width: "85%",
  },
  image: {
    width: "10%",
  },
  main: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
  },
}));
